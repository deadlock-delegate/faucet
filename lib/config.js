class Config {
    constructor () {
        this.config = {}
    }

    get (key) {
        return this.config[key]
    }

    set (key, value) {
        this.config[key] = value
    }

    merge (data) {
        Object.assign(this.config, data)
    }
}

module.exports = new Config()
