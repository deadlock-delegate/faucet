'use strict'

exports.up = async (knex, Promise) => {
    return knex.schema.createTable('roll', table => {
        table.bigIncrements('id').primary().unique()
        table.string('ip', 15).notNullable().index()
        table.string('address', 36).notNullable().index()
        table.timestamp('rolled_at').defaultTo(knex.fn.now())
    })
}

exports.down = async (knex, Promise) => {
    return knex.schema.dropTableIfExists('roll')
}
