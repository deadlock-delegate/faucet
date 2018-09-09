'use strict'

const fs = require('fs-extra')
const { Transaction, Roll } = require('./models')

class Database {
    /**
     * Create a new database connection.
     * @return {void}
     */
    async init (options) {
        if (options.client === 'sqlite3') {
            if (options.connection.filename !== ':memory:') {
                await fs.ensureFile(options.connection.filename)
            }
        }

        this.connection = require('knex')(options)

        await this.__migrate()
        await this.__initModels()
    }

    /**
     * Return the connection instance.
     * @return {Knex}
     */
    getConnection () {
        return this.connection
    }

    /**
     * Execute the seeds.
     * @return {void}
     */
    async seed () {
        return this.connection.seed.run()
    }

    /**
     * Setup the database models.
     * @return {void}
     */
    __initModels () {
        this.roll = new Roll(this.connection)
        this.transaction = new Transaction(this.connection)
    }

    /**
     * Execute the migrations.
     * @return {void}
     */
    async __migrate () {
        return this.connection.migrate.latest()
    }
}

module.exports = new Database()
