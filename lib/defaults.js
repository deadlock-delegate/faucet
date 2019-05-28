'use strict'

const path = require('path')

module.exports = {
  enabled: true,
  database: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: `${process.env.CORE_PATH_DATA}/plugins/@deadlock-delegate/faucet/database.sqlite`
    },
    migrations: {
      directory: path.resolve(__dirname, 'database/migrations'),
      tableName: 'migrations'
    },
    seeds: {
      directory: path.resolve(__dirname, 'database/seeds')
    },
    debug: false
  },
  server: {
    hapi: {
      host: '0.0.0.0',
      port: 5000,
      routes: {
        cors: true
      }
    }
  },
  relays: [`http://127.0.0.1:${process.env.ARK_API_PORT || 4003}`],
  walletAddress: '',
  walletPassphrase: '',
  walletSecondPassphrase: '',
  vendorField: 'deadlock faucet payout',
  payoutAmount: 100 * Math.pow(10, 8), // 100 (eg. ARK)
  payoutCooldown: 604800, // 7 days
  dailyPayoutLimit: 500 * Math.pow(10, 8) // 5000 (eg. ARK)
}
