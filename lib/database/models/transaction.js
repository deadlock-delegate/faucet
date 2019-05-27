const Model = require('./model')

class Transaction extends Model {
  /**
     * Get transaction by id
     * @param  {String} id
     * @return {Promise}
     */
  async findById (id) {
    return this.knex
      .select()
      .from('transaction')
      .where({ id })
      .first()
  }

  /**
     * Get transaction by transaction id
     * @param  {String} id
     * @return {Promise}
     */
  async findByTransactionId (transactionId) {
    return this.knex
      .select()
      .from('transaction')
      .where({ transaction_id: transactionId })
      .first()
  }

  /**
     * Get all transactions sent to address
     * @param  {string} address
     * @return {Promise}
     */
  async findAllByAddress (address) {
    return this.knex
      .select()
      .from('transaction')
      .where({ address })
  }

  /**
     * Get all transactions of a given state
     * @param  {string} address
     * @return {Promise}
     */
  async findAllByState (state) {
    return this.knex
      .select()
      .from('transaction')
      .where({ state })
  }

  /**
     * Create a transaction
     * @param  {str} address
     * @param  {int} amount
     * @return {Promise}
     */
  async create (address, amount) {
    const result = await this.knex('transaction').insert({ address, amount })
    if (!result) {
      return
    }
    return this.findById(result[0])
  }

  /**
     * Get sum of all sent amounts in x seconds
     * @param  {int} seconds how many seconds in the past to look, defaults to 86400 (24h)
     * @return {int}
     */
  async sumAmount (seconds = 86400) {
    const result = await this.knex('transaction')
      .where('created_at', '>=', this.knex.raw(`datetime('now', '-?? seconds')`, [seconds]))
      .whereNot('state', 'error')
      .sum('amount')
    return result[0]['sum(`amount`)']
  }

  /**
     * [updateStateForId description]
     * @param  {Integer} id id of a transaction entry
     * @param  {String} state
     * @return {Promise}
     */
  async updateStateForId (id, state) {
    return this.knex('transaction')
      .select()
      .from('transaction')
      .where({ id })
      .update('state', state)
  }

  /**
     * Update state of transactions in bulk
     * @param  {Array} transactionIds
     * @param  {String} state
     * @return {Promise} resolves to integer showing how many entries have been updated
     */
  async bulkUpdateState (transactionIds, state) {
    return this.knex('transaction')
      .select()
      .from('transaction')
      .whereIn('transaction_id', transactionIds)
      .update('state', state)
  }

  /**
     * Update transaction id of a given transaction
     * @param  {String} id [id of the entry]
     * @param  {String} transactionId [actual transaction id]
     * @return {Promise} resolves to integer showing how many entries have been updated
     */
  async updateTransactionId (id, transactionId) {
    return this.knex('transaction')
      .select()
      .from('transaction')
      .where({ id })
      .update('transaction_id', transactionId)
  }
}

module.exports = Transaction
