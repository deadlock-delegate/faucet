'use strict'

const BigNumberJS = require('bignumber.js')

const { ARKTOSHI } = require('@arkecosystem/crypto').constants

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
        return value.dividedBy(ARKTOSHI).toString()
    }

    static toString (value) {
        return BigNumber.new(value).dividedBy(ARKTOSHI).toString()
    }

    static satoshi (value) {
        return BigNumber.new(value).multipliedBy(ARKTOSHI)
    }
}
