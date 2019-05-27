'use strict'

const Hapi = require('hapi')
const { info } = require('../utils/logger')

/**
 * Creates a new hapi.js server.
 * @param  {Object} config
 * @return {Hapi.Server}
 */
module.exports = async config => {
  const server = new Hapi.Server(config.hapi)

  await server.register(require('./routes'))

  await server.start()

  info(`Server running at: ${server.info.uri}`)

  return server
}
