'use strict'

const app = require('@arkecosystem/core-container')
const config = app.resolvePlugin('config')
const { client, transactionBuilder } = require('@arkecosystem/crypto')

console.log('>>> config', config)
client.setConfig(config.network)

class Transaction {
    /**
     * Transaction construct
     * @param  {String} recipientId
     * @param  {Integer} amount
     * @param  {String} vendorField
     * @return {[type]}
     */
    constructor (recipientId, amount, vendorField) {
        this.transaction = transactionBuilder
            .transfer()
            .amount(amount)
            .recipientId(recipientId)
            .vendorField(vendorField)
    }

    /**
     * Sign a transaction
     * @param  {String} passphrase
     * @param  {String} secondPassphrase
     * @return {Void}
     */
    sign (passphrase, secondPassphrase) {
        this.transaction.sign(passphrase)
        if (secondPassphrase) {
            this.transaction.secondSign(secondPassphrase)
        }
    }

    /**
     * Get a transaction struct
     * @return {Object}
     */
    data () {
        return this.transaction.getStruct()
    }
}

module.exports = Transaction
