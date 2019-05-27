'use strict'

const { Transactions } = require('@arkecosystem/crypto')

class Transaction {
  /**
     * Transaction construct
     * @param  {String} recipientId
     * @param  {Integer} amount
     * @param  {String} vendorField
     * @return {[type]}
     */
  constructor (recipientId, amount, vendorField) {
    this.transaction = Transactions.BuilderFactory.transfer()
      .recipientId(recipientId)
      .amount(amount)
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
