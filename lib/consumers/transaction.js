'use strict'

const database = require('../database')
const { debug } = require('../utils/logger')

const { Enums } = require('@arkecosystem/crypto')

class TransactionConsumer {
  async process (transaction) {
    if (transaction.type !== Enums.TransactionTypes.Vote) {
      return
    }
    if (!this.__isSent(transaction.id)) {
      return
    }
    debug(`Received transaction ${transaction.id} sent to ${transaction.recipientId}`)
    this.__markTransactionAsDelivered(transaction)
  }

  /**
     * Update transaction state
     * @param {Transaction} transaction
     * @return {void}
     */
  async __markTransactionAsDelivered (transaction) {
    await database.transaction.bulkUpdateState([transaction.id], 'delivered')
    debug(`Transaction ${transaction.id} sent to ${transaction.recipientId} marked as delivered`)
  }

  /**
     * Checks if a given transaction exist and if its state is queued
     * @param  {Transaction} transaction
     * @return {bool}
     */
  async __isSent (txId) {
    const transaction = await database.transaction.findByTransactionId(txId)
    if (!transaction) {
      return false
    }
    return transaction.state === 'sent'
  }
}

module.exports = new TransactionConsumer()
