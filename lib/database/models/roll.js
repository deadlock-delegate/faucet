const Model = require('./model')
const config = require('../../config')

class Roll extends Model {
    /**
     * Get the latest roll
     * @param  {String} address
     * @param  {String} ip
     * @return {Promise}
     */
    async getLatest (ip, address) {
        return this.knex
            .select()
            .from('roll')
            .where({ address })
            .orWhere({ ip })
            .orderBy('rolled_at', 'desc')
            .first()
    }

    /**
     * Get the roll from id
     * @param  {Integer} id
     * @return {Promise}
     */
    async findById (id) {
        return this.knex
            .select()
            .from('roll')
            .where({ id })
            .first()
    }

    /**
     * Create a roll
     * @param  {String} ip
     * @param  {String} address
     * @return {Promise}
     */
    async create (ip, address) {
        const createdIds = await this.knex('roll').insert({ address, ip })

        return this.findById(createdIds[0])
    }

    /**
     * Is a given address or IP eligible for another roll
     * @param  {String} ip
     * @param  {String} address
     * @return {Boolean}
     */
    async isEligible (ip, address) {
        const latestRoll = await this.getLatest(ip, address)
        const coolDownMs = config.get('payoutCooldown') * 1000
        if (latestRoll && new Date(latestRoll.rolled_at) - new Date() <= coolDownMs) {
            return false
        }
        return true
    }
}

module.exports = Roll
