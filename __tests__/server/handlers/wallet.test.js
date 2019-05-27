'use strict'

const defaults = require('../../../lib/defaults')
const database = require('../../../lib/database')
const startServer = require('../../../lib/server')

const walletAddress = 'DFSByMjuFNQy1MkRyyBPxEr6fqsu2w5ava'
const walletAddressExists = 'D5rHMAmTXVbG7HVF3NvTN3ghpWGEii5mH2'

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

describe('Server - Handlers - Wallet', () => {
  describe('transactions', () => {
    it('should return array of transaction of a given address', async () => {
      const response = await instance.inject({
        method: 'GET',
        url: `/wallet/${walletAddressExists}/transactions`
      })

      expect(response.statusCode).toBe(200)
      expect(JSON.parse(response.payload)).toBeArray()
    })

    it('should return 404 if there are no transactions', async () => {
      const response = await instance.inject({
        method: 'GET',
        url: `/wallet/${walletAddress}/transactions`
      })

      expect(response.statusCode).toBe(404)
    })
  })
})
