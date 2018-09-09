'use strict'

const Boom = require('boom')
const database = require('../../database')

/**
 * @type {Object}
 */
exports.show = {
    /**
   * @param  {Hapi.Request} request
   * @param  {Hapi.Toolkit} h
   * @return {Hapi.Response}
   */
    async handler (request, h) {
        const transaction = await database.transaction.findByTransactionId(request.params.id)

        if (!transaction) {
            return Boom.notFound()
        }

        return transaction
    }
}
