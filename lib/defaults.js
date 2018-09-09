'use strict'

const path = require('path')

module.exports = {
    database: {
        client: 'sqlite3',
        useNullAsDefault: true,
        connection: {
            filename: `${process.env.ARK_PATH_DATA}/plugins/deadlock-faucet/database.sqlite`
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
    payoutAmount: 5 * Math.pow(10, 8), // 5 (eg. ARK)
    payoutCooldown: 259200, // 3 days
    dailyPayoutLimit: 200 * Math.pow(10, 8) // 200 (eg. ARK)
}
