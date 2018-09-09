'use strict'

const Boom = require('boom')
const container = require('@arkecosystem/core-container')
const wallet = container.resolvePlugin('database').walletManager
const database = require('../../database')
const config = require('../../config')
const BigNumber = require('../../utils/bignumber')

/**
 * @type {Object}
 */
exports.create = {
    /**
   * @param  {Hapi.Request} request
   * @param  {Hapi.Toolkit} h
   * @return {Hapi.Response}
   */
    async handler (request, h) {
        const ip = request.headers['x-forwarded-for'] || request.info.remoteAddress
        const address = request.payload.address

        const faucet = wallet.findByAddress(config.get('walletAddress'))
        if (BigNumber.new(faucet.balance) < config.get('payoutAmount')) {
            return Boom.resourceGone('Faucet dried up and has no more funds.')
        }

        const dailyPayouts = await database.transaction.sumAmount()
        if (dailyPayouts > config.get('dailyPayoutLimit')) {
            return Boom.tooManyRequests('Daily payout limit has been reached.')
        }

        const isEligible = await database.roll.isEligible(ip, address)
        if (!isEligible) {
            return Boom.badRequest('Not eligible for another roll.')
        }

        await database.roll.create(ip, address)
        await database.transaction.create(address, config.get('payoutAmount'))

        return h.response({}).code(201)
    }
}
