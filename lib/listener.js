'use strict'

const { app } = require('@arkecosystem/core-container')
const emitter = app.resolvePlugin('event-emitter')
const transactionConsumer = require('./consumers/transaction')

class EventListener {
  /**
     * Bootstrap any event listeners.
     * @return {void}
     */
  boot () {
    emitter.on('transaction.applied', transaction => transactionConsumer.process(transaction))
  }
}

module.exports = new EventListener()
