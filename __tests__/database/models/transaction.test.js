'use strict'

const delay = require('delay')
const Transaction = require('../../../lib/Database/models/transaction')

let transactionTest
const address = 'DFSByMjuFNQy1MkRyyBPxEr6fqsu2w5ava'
const amount = 10 * Math.pow(10, 8)

beforeEach(async done => {
  const options = require('../../../lib/defaults').database
  options.connection.filename = ':memory:'

  const knex = require('knex')(options)
  await knex.migrate.latest()

  transactionTest = new Transaction(knex)

  done()
})

describe('Database - Models - Transaction', () => {
  describe('findById', () => {
    it('should be a function', () => {
      expect(transactionTest.findById).toBeFunction()
    })

    it('should get transaction with id', async () => {
      const tx = await transactionTest.create(address, 1)
      const result = await transactionTest.findById(tx.id)
      expect(result.id).toBe(tx.id)
    })

    it('should return undefined if transaction does not exist', async () => {
      const id = require('crypto').randomBytes(64).toString('hex')
      const result = await transactionTest.findById(id)
      expect(result).toBe(undefined)
    })
  })

  describe('findAllByAddress', () => {
    it('should be a function', () => {
      expect(transactionTest.findAllByAddress).toBeFunction()
    })

    it('should get all transactions belonging to address', async () => {
      await transactionTest.create('DERPicaX6vmokK3x8abBMDpi8GMPc7rLiW', 1)

      for (let item of [1, 2, 3]) { // eslint-disable-line no-unused-vars
        await transactionTest.create(address, 1)
      }

      const result = await transactionTest.findAllByAddress(address)
      expect(result.length).toBe(3)
    })

    it('should get empty array if address has 0 transactions', async () => {
      const result = await transactionTest.findAllByAddress(address)
      expect(result.length).toBe(0)
    })
  })

  describe('create', () => {
    it('should be a function', () => {
      expect(transactionTest.create).toBeFunction()
    })

    it('should create a transaction', async () => {
      const tx = await transactionTest.create(address, 1)

      const result = await transactionTest.findById(tx.id)
      expect(result.id).toBe(tx.id)
    })
  })

  describe('sumAmount', () => {
    it('should be a function', () => {
      expect(transactionTest.sumAmount).toBeFunction()
    })

    it('should get sum of payouts for the last 24 hours', async () => {
      await transactionTest.create(address, amount)
      await transactionTest.create(address, amount)

      const result = await transactionTest.sumAmount()
      expect(result).toBe(20 * Math.pow(10, 8))
    })

    it('should get sum of payouts for the last 2 seconds only', async () => {
      await transactionTest.create(address, amount)
      await delay(4000)
      await transactionTest.create(address, amount)

      const result = await transactionTest.sumAmount(2)
      expect(result).toBe(10 * Math.pow(10, 8))
    })
  })

  describe('bulkUpdateState', () => {
    it('should be a function', () => {
      expect(transactionTest.bulkUpdateState).toBeFunction()
    })

    it('should update state of multiple entries', async () => {
      await transactionTest.create(address, amount)
      await transactionTest.create(address, amount)

      const result1 = await transactionTest.findAllByAddress(address)
      expect(result1.filter(x => x.transaction_id).length).toBe(0)

      const transactionId1 = '84712486-138a-403c-b31d-c7eb496c3ffb'
      const transactionId2 = '079d0bc6-555c-49b2-abbd-49081f410d8e'

      await transactionTest.updateTransactionId(result1[0].id, transactionId1)
      await transactionTest.updateTransactionId(result1[1].id, transactionId2)

      const result2 = await transactionTest.findAllByAddress(address)
      expect(result2.filter(x => x.transaction_id).length).toBe(2)
    })

    it('should not resolve to undefined if entries do not exist', async () => {
      const result = await transactionTest.bulkUpdateState(
        ['84712486-138a-403c-b31d-c7eb496c3ffb'], 'sent'
      )
      expect(result).toBe(0)
    })
  })

  describe('findAllByState', () => {
    it('should be a function', () => {
      expect(transactionTest.findAllByState).toBeFunction()
    })

    it('should find entries with state queued', async () => {
      await transactionTest.create(address, amount)
      await transactionTest.create(address, amount)
      const result = await transactionTest.findAllByState('queued')
      expect(result.length).toBe(2)
    })

    it('should return 0 if it does not find entries', async () => {
      const result = await transactionTest.findAllByState('sent')
      expect(result.length).toBe(0)
    })
  })

  describe('updateTransactionId', () => {
    it('should be a function', () => {
      expect(transactionTest.updateTransactionId).toBeFunction()
    })

    it('should update transaction ids', async () => {
      const tx1 = await transactionTest.create(address, amount)
      const tx2 = await transactionTest.create(address, amount)

      const transactionId1 = '84712486-138a-403c-b31d-c7eb496c3ffb'
      const transactionId2 = '079d0bc6-555c-49b2-abbd-49081f410d8e'

      await transactionTest.updateTransactionId(tx1.id, transactionId1)
      await transactionTest.updateTransactionId(tx2.id, transactionId2)

      const result1 = await transactionTest.findById(tx1.id)
      expect(result1.transaction_id).toBe(transactionId1)

      const result2 = await transactionTest.findById(tx2.id)
      expect(result2.transaction_id).toBe(transactionId2)
    })
  })

  describe('findByTransactionId', () => {
    it('should be a function', () => {
      expect(transactionTest.findByTransactionId).toBeFunction()
    })

    it('should get transaction', async () => {
      const tx = await transactionTest.create(address, amount)

      const transactionId = '84712486-138a-403c-b31d-c7eb496c3ffb'
      await transactionTest.updateTransactionId(tx.id, transactionId)

      const result = await transactionTest.findByTransactionId(transactionId)
      expect(result.transaction_id).toBe(transactionId)
    })

    it('should not get transaction if it does not exist', async () => {
      const transactionId = '84712486-138a-403c-b31d-c7eb496c3ffb'
      const result = await transactionTest.findByTransactionId(transactionId)
      expect(result).toBe(undefined)
    })
  })
})
