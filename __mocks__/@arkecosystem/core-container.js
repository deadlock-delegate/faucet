'use strict'

const container = jest.mock('@arkecosystem/core-container')

container.resolvePlugin = name => {
    if (name === 'logger') {
        return {
            info: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
            debug: jest.fn()
        }
    }

    if (name === 'database') {
        return {
            transactions: {
                getFeeStatistics: () => {
                    return [{
                        type: 0,
                        minFee: 1,
                        maxFee: 3,
                        avgFee: 2
                    }]
                }
            },
            walletManager: {
                getLocalWallets: () => {
                    return [{
                        username: 'genesis_17',
                        address: 'AJPicaX6vmokoK3x8abBMDpi8GMPc7rLiW',
                        publicKey: '03d7dfe44e771039334f4712fb95ad355254f674c8f5d286503199157b7bf7c357',
                        vote: 'dummy-delegate-pubkey',
                        balance: 100 * Math.pow(10, 8)
                    }]
                },
                findByAddress: () => {
                    return {
                        username: 'genesis_17',
                        address: 'AJPicaX6vmokoK3x8abBMDpi8GMPc7rLiW',
                        publicKey: '03d7dfe44e771039334f4712fb95ad355254f674c8f5d286503199157b7bf7c357',
                        vote: 'dummy-delegate-pubkey',
                        balance: 100 * Math.pow(10, 8)
                    }
                },
                findByUsername: () => {
                    return {
                        username: 'genesis_17',
                        address: 'AJPicaX6vmokoK3x8abBMDpi8GMPc7rLiW',
                        publicKey: '03d7dfe44e771039334f4712fb95ad355254f674c8f5d286503199157b7bf7c357',
                        vote: 'dummy-delegate-pubkey',
                        balance: 100 * Math.pow(10, 8)
                    }
                }
            }
        }
    }

    return {}
}

module.exports = container
