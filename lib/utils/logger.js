const { app } = require('@arkecosystem/core-container')
const logger = app.resolvePlugin('logger')

module.exports = class Logger {
  static info (message) {
    return logger.info(`[Faucet] ${message}`)
  }

  static warn (message) {
    return logger.warn(`[Faucet] ${message}`)
  }

  static error (message) {
    return logger.error(`[Faucet] ${message}`)
  }

  static debug (message) {
    return logger.debug(`[Faucet] ${message}`)
  }
}
