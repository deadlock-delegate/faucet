'use strict'

const defaults = require('../../../lib/defaults')
const database = require('../../../lib/database')
const startServer = require('../../../lib/server')
const config = require('../../../lib/config')

const address = 'DFSByMjuFNQy1MkRyyBPxEr6fqsu2w5ava'
const addressExists = 'D5rHMAmTXVbG7HVF3NvTN3ghpWGEii5mH2'
const ipExists = '127.0.0.1'

let instance
beforeAll(async () => {
    defaults.database.connection.filename = ':memory:'
    await database.init(defaults.database)
    await database.seed()

    instance = await startServer(defaults.server)
})

afterAll(async () => {
    await instance.stop()
})

describe('Server - Handlers - Roll', () => {
    describe('create', () => {
        it('should create a new roll and return status code of 201', async () => {
            const response = await instance.inject({
                method: 'POST',
                url: '/rolls',
                payload: { address },
                remoteAddress: '127.0.0.2'
            })

            expect(response.statusCode).toBe(201)
        })

        it('should reject a roll for address which rolled not long ago', async () => {
            const response = await instance.inject({
                method: 'POST',
                url: '/rolls',
                payload: { address: addressExists },
                remoteAddress: '127.0.0.1'
            })

            expect(response.statusCode).toBe(400)
        })

        it('should reject a roll for IP which rolled not long ago', async () => {
            const response = await instance.inject({
                method: 'POST',
                url: '/rolls',
                payload: { address },
                remoteAddress: ipExists
            })

            expect(response.statusCode).toBe(400)
        })

        it('should return bad request if no address is passed along', async () => {
            const response = await instance.inject({
                method: 'POST',
                url: '/rolls',
                payload: { undefined },
                remoteAddress: ipExists
            })

            expect(response.statusCode).toBe(400)
        })

        it('should error if no IP is passed along', async () => {
            const response = await instance.inject({
                method: 'POST',
                url: '/rolls',
                payload: { address },
                remoteAddress: undefined
            })

            expect(response.statusCode).toBe(400)
        })

        it('should error if daily payout limit has been reached', async () => {
            config.set('dailyPayoutLimit', 8)
            const response = await instance.inject({
                method: 'POST',
                url: '/rolls',
                payload: { address },
                remoteAddress: '127.0.0.2'
            })
            const data = JSON.parse(response.payload)
            expect(data.message).toBe('Faucets daily payout limit has been reached.')
            expect(response.statusCode).toBe(429)
        })

        it('should error if faucet ran out of funds', async () => {
            config.set('payoutAmount', 1000 * Math.pow(10, 8))
            const response = await instance.inject({
                method: 'POST',
                url: '/rolls',
                payload: { address },
                remoteAddress: '127.0.0.2'
            })
            const data = JSON.parse(response.payload)
            expect(data.message).toBe('Faucet dried up and has no more funds.')
            expect(response.statusCode).toBe(410)
        })
    })
})
