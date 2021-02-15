const fetch = require('node-fetch')


class BtcExchangeService {
    
    constructor(accessKey) {
        this.accessKey = accessKey
        this.target = "USD"
        this.symbols = "BTC"
    }

    async exchangeBTCUSD() {
        try {
            const url = `http://api.coinlayer.com/api/live?access_key=${this.accessKey}&target=${this.target}&symbols=${this.symbols}`
            const response = await fetch(url)
            const jsonRes = await response.json()
            const {timestamp} = jsonRes
            return {timestamp, rates: jsonRes.rates.BTC}
        } catch(e) {
            console.log(e.response);
        }
    }
}

module.exports = {BtcExchangeService}