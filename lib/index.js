'use strict'

const app = require('./app')

/**
 * The struct used by the plugin container.
 * @type {Object}
 */
exports.plugin = {
    pkg: require('../package.json'),
    defaults: require('./defaults'),
    alias: 'deadlock:faucet',
    async register (container, options) {
        return app.start(container, options)
    },
    async deregister (container, options) {
        return app.stop(container, options)
    }
}
