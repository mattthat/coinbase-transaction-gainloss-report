## coinbase-transaction-gainloss-report

a processing tool for gain/loss details given a Coinbase transaction report

### usage

* Export some transaction report from Coinbase in CSV, let's call it original-data.csv
* Remove superfluous lines with head
* Produce analysis for report
```bash
$ head -7 original-data.csv > report.csv
$ src/index.js report.csv
```
* Example output... 

```bash
$ src/index.js example-report.csv | jq
```
```json
{
  "reference": {
    "assets": [
      "BTC",
      "ETH"
    ],
    "positions": {
      "BTC": 123,
      "ETH": 123
    },
    "costs": {
      "BTC": 123,
      "ETH": 123
    }
  },
  "assets": {
    "BTC": {
      "asset": "BTC",
      "position": 123,
      "average": 1,
      "price": 49025.45135929,
      "cost": 123,
      "mark": 6030130.517192669,
      "net": 6030007.517192669
    },
    "ETH": {
      "asset": "ETH",
      "position": 123,
      "average": 1,
      "price": 3234.50463372,
      "cost": 123,
      "mark": 397844.06994756,
      "net": 397721.06994756
    }
  },
  "totals": {
    "totalCost": 246,
    "totalMark": 6427974.5871402295,
    "totalNet": 6427728.5871402295
  }
}
```
