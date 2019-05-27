'use strict'

const Boom = require('boom')
const requestIp = require('request-ip')
const { Identities } = require('@arkecosystem/crypto')
const { app } = require('@arkecosystem/core-container')
const wallet = app.resolvePlugin('database').walletManager
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
    const ip = requestIp.getClientIp(request)
    const address = request.payload.address

    if (!Identities.Address.validate(address)) {
      return Boom.badRequest('Your address is not correct.')
    }

    const faucet = wallet.findByAddress(config.get('walletAddress'))
    if (BigNumber.new(faucet.balance) < config.get('payoutAmount')) {
      return Boom.resourceGone('Faucet dried up and has no more funds.')
    }

    const dailyPayouts = await database.transaction.sumAmount()
    if (dailyPayouts > config.get('dailyPayoutLimit')) {
      return Boom.tooManyRequests('Faucets daily payout limit has been reached.')
    }

    const isEligible = await database.roll.isEligible(ip, address)
    if (!isEligible) {
      return Boom.badRequest("You can't request another payment.")
    }

    await database.roll.create(ip, address)
    await database.transaction.create(address, config.get('payoutAmount'))

    return h.response({}).code(201)
  }
}
