const {BtcExchangeService} = require('./utils/exchange')
const {AirTableService} = require('./utils/airtable')

// need to create .env and put token there.
// AIRTABLE_API_KEY = your api key
// AIRTABLE_BASE_ID = your base id
// COINLAYER_ACCESS_KEY = your acces key (coinlayer API)
require('dotenv').config()

 
const btcRateMap = {}           // btc rate to be store
const cachedTimestampMap = {}   // cached timestamp has stored - to prevent duplicates
const btcExchangeService = new BtcExchangeService(process.env.COINLAYER_ACCESS_KEY)
const airTableService = new AirTableService(process.env.AIRTABLE_API_KEY, process.env.AIRTABLE_BASE_ID)


const bitcoinFetcher = async () => {
    console.log("run bitcoinFetcher()")
    try {
        const exchangeRes = await btcExchangeService.exchangeBTCUSD()
        // to prevent duplicate records
        if (!btcRateMap.hasOwnProperty(exchangeRes.timestamp) && !cachedTimestampMap.hasOwnProperty(exchangeRes.timestamp)) {
            btcRateMap[exchangeRes.timestamp] = exchangeRes
        } else {
            console.warn(`property ${exchangeRes.timestamp} exist`)
        }
        // for debug
        console.log(`bitcoinFetcher() - btcRateMap.length= ${Object.keys(btcRateMap).length}`)
    } catch (error) {
        console.error(`bitcoinFetcher()`, error)
    }
}

const airtableSaver = async() => {
    console.log("run airtableSaver()")
    try {
        const airtableRes = await airTableService.save(btcRateMap)
        if (!airtableRes){
             return
        }

        // should delete from btcRateMap the specified id's we get in response
        airtableRes.forEach(record => {
            const timestamp = new Date(record.fields.Time).getTime() / 1000
            // delete from map - it's saved
            delete btcRateMap[timestamp]
            cachedTimestampMap[timestamp] = 'saved'
        })
        // for debug
        console.log(`airtableSaver() - btcRateMap.length= ${Object.keys(btcRateMap).length}`)
    } catch (error) {
        console.error(`airtableSaver()`, error)
        btcExchangeRateList = btcExchangeRateListTmp
    }
}

(() => {
    try {
        setInterval(bitcoinFetcher, 60 * 1000)
        setInterval(airtableSaver, 60 * 1000)
        bitcoinFetcher()
    } catch (error) {
        console.error(`Main process`, error)
    }
})()