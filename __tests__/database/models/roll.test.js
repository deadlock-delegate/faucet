'use strict'

const delay = require('delay')
const Roll = require('../../../lib/Database/models/roll')

let rollTest
const address = 'DFSByMjuFNQy1MkRyyBPxEr6fqsu2w5ava'
const ip = '127.0.0.1'

beforeEach(async done => {
  const options = require('../../../lib/defaults').database
  options.connection.filename = ':memory:'

  const knex = require('knex')(options)
  await knex.migrate.latest()

  rollTest = new Roll(knex)

  done()
})

describe('Database - Models - Transaction', () => {
  describe('findById', () => {
    it('should be a function', () => {
      expect(rollTest.findById).toBeFunction()
    })

    it('should get the roll with id', async () => {
      const roll = await rollTest.create(address, ip)

      const result = await rollTest.findById(roll.id)
      expect(result.id).toBe(roll.id)
    })

    it('should return undefined if roll does not exist', async () => {
      const result = await rollTest.findById(1)
      expect(result).toBe(undefined)
    })
  })

  describe('getLatest', () => {
    it('should be a function', () => {
      expect(rollTest.getLatest).toBeFunction()
    })

    it('should get the latest roll', async () => {
      await rollTest.create(ip, address)
      await delay(1000)
      const second = await rollTest.create(ip, address)

      const result = await rollTest.getLatest(ip, address)
      expect(result.rolled_at).toBe(second.rolled_at)
    })

    it('should get correct roll even if user changes ip or address', async () => {
      await rollTest.create(ip, address)
      await delay(1000)
      const second = await rollTest.create('127.0.0.2', address)

      const result = await rollTest.getLatest('127.0.0.2', address)
      expect(result.rolled_at).toBe(second.rolled_at)

      await delay(1000)
      const third = await rollTest.create(ip, 'DERPcaX6vmokoK3x8abBMDpi8GMPc7rLiW')

      const resultSecond = await rollTest.getLatest(ip, 'DERPcaX6vmokoK3x8abBMDpi8GMPc7rLiW')
      expect(resultSecond.rolled_at).toBe(third.rolled_at)

      const resultThird = await rollTest.getLatest(
        '127.0.0.2', 'DERPcaX6vmokoK3x8abBMDpi8GMPc7rLiW'
      )
      expect(resultThird.rolled_at).toBe(third.rolled_at)
    })

    it('shoud get undefined if there are no roll entries', async () => {
      const result = await rollTest.getLatest(address, ip)
      expect(result).toBe(undefined)
    })
  })

  describe('isEligible', () => {
    it('should be eligible without entries', async () => {
      await expect(rollTest.isEligible(address, ip)).resolves.toBe(true)
    })

    it('should not be eligible if a roll was done less then `payoutCooldown`', async () => {
      await rollTest.create(address, ip)
      await expect(rollTest.isEligible(address, ip)).resolves.toBe(false)
    })

    it('should not be eligible even if IP is different but address is the same', async () => {
      await rollTest.create(ip, address)
      const result = await rollTest.isEligible('127.0.0.2', address)
      expect(result).toBe(false)
    })

    it('should not be eligible even if address is different but IP is the same', async () => {
      await rollTest.create(ip, address)
      const result = await rollTest.isEligible(ip, 'DERPcaX6vmokoK3x8abBMDpi8GMPc7rLiW')
      expect(result).toBe(false)
    })
  })
})
