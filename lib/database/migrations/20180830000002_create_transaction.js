'use strict'

exports.up = async (knex, Promise) => {
  return knex.schema.createTable('transaction', table => {
    table.increments('id').primary().unique()
    table.string('transaction_id').unique().index()
    table.string('address', 36).notNullable().index()
    table.bigInteger('amount').unsigned()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.enu('state', ['queued', 'sent', 'delivered', 'error']).defaultTo('queued')
  })
}

exports.down = async (knex, Promise) => {
  return knex.schema.dropTableIfExists('transaction')
}
