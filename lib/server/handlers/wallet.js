'use strict'

const Boom = require('boom')
const database = require('../../database')

/**
 * @type {Object}
 */
exports.transactions = {
    /**
   * @param  {Hapi.Request} request
   * @param  {Hapi.Toolkit} h
   * @return {Hapi.Response}
   */
    async handler (request, h) {
        const transactions = await database.transaction.findAllByAddress(request.params.address)
        if (!transactions.length) {
            return Boom.notFound()
        }

        return transactions
    }
}
