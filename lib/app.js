'use strict'

const config = require('./config')
const database = require('./database')
const logger = require('./utils/logger')
const listener = require('./listener')
const transactionProcessor = require('./processors/transaction')

class App {
  /**
     * Start the application.
     * @param  {Container} container
     * @param  {Object} options
     * @return {Hapi}
     */
  async start (container, options) {
    logger.info('Initializing Configuration')
    config.merge(options)

    logger.info('Initialising Database')
    await database.init(options.database)

    logger.info('Starting event listener')
    listener.boot()

    logger.info('Starting transaction processor')
    transactionProcessor.boot()

    logger.info('Starting faucet api')
    return require('./server')(options.server)
  }

  /**
     * Stop the application.
     * @param  {Container} container
     * @param  {Object} options
     * @return {Promise}
     */
  async stop (container, options) {
    if (options.server.enabled) {
      logger.info('Stopping Payroll Server')

      return container.resolvePlugin('deadlock:faucet').stop()
    }
  }
}

module.exports = new App()
