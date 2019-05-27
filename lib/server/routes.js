'use strict'

const roll = require('./handlers/roll')
const wallet = require('./handlers/wallet')
const transaction = require('./handlers/transaction')

/**
 * Register routes
 * @param  {Hapi.Server} server
 * @param  {Object} options
 * @return {void}
 */
const register = async (server, options) => {
  server.route([
    { method: 'POST', path: '/rolls', ...roll.create },

    { method: 'GET', path: '/transaction/{id}', ...transaction.show },

    { method: 'GET', path: '/wallet/{address}/transactions', ...wallet.transactions }
  ])
}

/**
 * The struct used by hapi.js.
 * @type {Object}
 */
exports.plugin = {
  name: 'hapi.js Routes',
  version: '0.1.0',
  register
}
