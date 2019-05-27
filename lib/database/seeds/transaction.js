exports.seed = async (knex, Promise) => {
  await knex('transaction').del()

  return knex('transaction').insert([{
    id: 1,
    address: 'D5rHMAmTXVbG7HVF3NvTN3ghpWGEii5mH2',
    transaction_id: 'd8a58d8c-44e3-4bed-9a87-b25d53e1c650',
    amount: 10
  },
  {
    id: 2,
    address: 'D5rHMAmTXVbG7HVF3NvTN3ghpWGEii5mH2',
    transaction_id: '0b39a0de-31e2-4bf7-b9df-b2bd09a30255',
    amount: 10
  }])
}
