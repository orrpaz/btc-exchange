# btc-exchange

## Goal

a Node.js program that reads and stores the current Bitcoin-to-USD
exchange rate every minute to an online spreadsheet. I use Airtable, an
online spreadsheet application, for storing the results.

Once the code runs, it should be robust enough to handle errors from Airtable,
and not "lose" any BTC data. For example: if Airtable is down for 10 minutes, the
code will still update the known rates when Airtable is available again.
