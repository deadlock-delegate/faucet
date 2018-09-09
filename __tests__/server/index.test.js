'use strict'

const serverTest = require('../../lib/server')
const { server: options } = require('../../lib/defaults')

describe('Server', () => {
    it('should be a function', () => {
        expect(serverTest).toBeFunction()
    })

    it('should fail if the options are invalid', async () => {
        await expect(serverTest({
            enabled: false,
            whitelist: ['127.0.0.1'],
            hapi: {
                host: 's#dfgä',
                port: 5000,
                routes: {
                    cors: true
                }
            }
        })).rejects.toThrow()
    })

    it('should fail if a server is already running', async () => {
        const server1 = await serverTest(options)

        await expect(serverTest(options)).rejects.toThrow()

        await server1.stop()
    })
})
