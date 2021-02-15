const airTable = require('airtable')



class AirTableService {
  constructor(apiKey,baseID) {
    this.apiKey = apiKey
    this.baseID = baseID
    this.base = new airTable({apiKey}).base(baseID);
  }

  async save(btcRateMap) {
    if(!Object.keys(btcRateMap).length) {
      console.warn(`AirTableService - save() - btcExchangeRateList is empty`)
      return
    }

    // Prepare data to airtable
    const projectedBtcExchangeRateList =  Object.keys(btcRateMap).map(key => {
      const obj = btcRateMap[key]
      return {
        fields: {
          Time: new Date(obj.timestamp * 1000),
          Rates: obj.rates
        }
      }
    })
    
    // Save to Airtable
    try {
      const airtableRes = await this.base('BTC Table').create(projectedBtcExchangeRateList)
      console.log(`Saved: ${airtableRes.length}`)
      return airtableRes
    } catch(error) {
      console.error(`AirTableService - save()`, error)
    }
  }
}


module.exports = {AirTableService}