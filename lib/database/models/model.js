'use strict'

module.exports = class Model {
    /**
     * Create a new database model instance.
     * @return {void}
     */
    constructor (knex) {
        this.knex = knex
    }
}
