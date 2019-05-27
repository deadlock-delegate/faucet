'use strict'

const BigNumberJS = require('bignumber.js')

const { Constants } = require('@arkecosystem/crypto')

BigNumberJS.config({
  DECIMAL_PLACES: 8
})

module.exports = class BigNumber {
  static new (value) {
    return new BigNumberJS(value)
  }

  static sum (data, key) {
    let total = BigNumber.new(0)

    data.forEach(item => {
      if (Number.isInteger(item[key])) {
        item[key] = BigNumber.new(item[key])
      }

      total = total.plus(item[key])
    })

    return total
  }

  static human (value) {
    return value.dividedBy(Constants.ARKTOSHI).toString()
  }

  static toString (value) {
    return BigNumber.new(value).dividedBy(Constants.ARKTOSHI).toString()
  }

  static satoshi (value) {
    return BigNumber.new(value).multipliedBy(Constants.ARKTOSHI)
  }
}
