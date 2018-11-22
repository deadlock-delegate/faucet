'use strict'

const axios = require('axios')
const container = require('@arkecosystem/core-container')
const delay = require('delay')
const { chunk } = require('lodash')
const Transaction = require('../utils/transaction')
const { debug, info, warn, error } = require('../utils/logger')
const database = require('../database')
const config = require('../config')

class TransactionProcessor {
    /**
     * Bootstrap roll processor
     * @return {void}
     */
    boot () {
        this.process()
    }

    async process () {
        debug('Looking for queued transactions.')
        const transactions = await database.transaction.findAllByState('queued')
        if (transactions) {
            debug(`Found ${transactions.length} queued transactions.`)
            const chunks = chunk(transactions, this.__getMaximumTransactions())
            for (const chunk of chunks) {
                const txs = await this.generateTransactions(chunk)
                const acceptedTransactionsIds = await this.broadcast(txs)
                await this.updateTransactionState(acceptedTransactionsIds, 'sent')
            }
        } else {
            debug('Did not find any queued transactions.')
        }
        await delay(5000)
        await this.process()
    }

    /**
     * Updates the state of transactions
     * @param  {Array} transactionIds list of transaction ids
     * @param  {String} state
     * @return {Promise}
     */
    async updateTransactionState (transactionIds, state) {
        const updatedCount = await database.transaction.bulkUpdateState(transactionIds, state)
        if (updatedCount !== transactionIds.length) {
            warn(`Updated ${updatedCount} transaction states out of given ${transactionIds.length}
                transactions.`)
        }
    }

    /**
     * Generates an array of signed transaction object and updates the transaction id in the db
     * @param  {Array} transactions
     * @return {Array}
     */
    async generateTransactions (transactions) {
        const txs = []
        for (let transaction of transactions) {
            let tx = new Transaction(
                transaction.address,
                transaction.amount,
                config.get('vendorField')
            )

            tx.sign(config.get('walletPassphrase'), config.get('walletSecondPassphrase'))
            const txData = tx.data()

            try {
                await database.transaction.updateTransactionId(transaction.id, txData.id)
            } catch (err) {
                if (err.code !== 'SQLITE_CONSTRAINT') {
                    throw err
                }
                error(`Received an SQLITE_CONSTRAINT error for id ${transaction.id}:
                    ${JSON.stringify(err)}`)
                await database.transaction.updateStateForId(transaction.id, 'error')
                debug(`Updated status of ${transaction.id} transaction entry to error`)
                continue
            }

            txs.push(txData)
        }
        return txs
    }

    /**
     * Broadcasts a list of transaction objects
     * @param  {Array} array containing Transaction structs
     * @return {Promise}
     */
    async broadcast (transactions) {
        const relay = config.get('relays')[0]
        const response = await axios.post(`${relay}/api/v2/transactions`, { transactions })
        const allTransactionIds = transactions.map(tx => tx.id)
        const accepted = response.data.data.accept
        const rejected = allTransactionIds.filter(id => !accepted.includes(id))
        if (rejected.length) {
            warn(`${rejected.length} transactions have been rejected`)
            await this.updateTransactionState(rejected, 'error')
        }
        info(`${accepted.length} out of ${transactions.length} transactions have been accepted`)
        return accepted
    }

    /**
     * Get the maximum number of transactions per block.
     * @return {Number}
     */
    __getMaximumTransactions () {
        return container.resolvePlugin('config')
            .getConstants(this.height)
            .block.maxTransactions
    }
}

module.exports = new TransactionProcessor()
