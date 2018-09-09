'use strict'

const defaults = require('../../../lib/defaults')
const database = require('../../../lib/database')
const startServer = require('../../../lib/server')

const addressExists = 'D5rHMAmTXVbG7HVF3NvTN3ghpWGEii5mH2'
const transactionExists = 'd8a58d8c-44e3-4bed-9a87-b25d53e1c650'

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

describe('Server - Handlers - Transaction', () => {
    describe('show', () => {
        it('should show transaction with a specific id', async () => {
            const response = await instance.inject({
                method: 'GET',
                url: `/transaction/${transactionExists}`
            })

            expect(response.statusCode).toBe(200)
            expect(JSON.parse(response.payload).address).toBe(addressExists)
        })

        it('should return 404 if transaction does not exists', async () => {
            const response = await instance.inject({
                method: 'GET',
                url: `/transaction/not-existing`
            })

            expect(response.statusCode).toBe(404)
        })
    })
})
