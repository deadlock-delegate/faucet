exports.seed = async (knex, Promise) => {
    await knex('roll').del()

    return knex('roll').insert([{
        ip: '127.0.0.1',
        address: 'D5rHMAmTXVbG7HVF3NvTN3ghpWGEii5mH2'
    }])
}
