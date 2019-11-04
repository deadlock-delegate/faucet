'use strict'

const axios = require('axios')
const { Transactions } = require('@arkecosystem/crypto')
const BigNumber = require('./bignumber')

class Transaction {
  /**
     * Transaction construct
     * @param  {String} recipientId
     * @param  {Integer} amount
     * @param  {String} vendorField
     * @return {[type]}
     */
  constructor (recipientId, amount, vendorField, ) {
    this.transaction = Transactions.BuilderFactory.transfer()
      .recipientId(recipientId)
      .amount(amount)
      .vendorField(vendorField)
      .version(2)
  }

  /**
   * Sets the nonce of the transaction
   */
  async setNonce (relay, senderAddress) {
    const nonce = await this.fetchNonce(relay, senderAddress)
    this.transaction.nonce(BigNumber.new(nonce).plus(1))
  }

  /**
   * Fetches the latest nonce from the API for the sending wallet
   */
  async fetchNonce (relay, senderAddress) {
    const options = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      url: `${relay}/api/wallets/${senderAddress}`
    }
    try {
      const response = await axios(options)
      return response.data.data.nonce
    } catch (ex) {
      // Could be a cold wallet
      return "0";
    }
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
