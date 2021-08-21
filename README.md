## coinbase-transaction-gainloss-report

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
[
  {
    "BTC": {
      "asset": "BTC",
      "position": 123,
      "average": 1,
      "price": 49335.1115039,
      "cost": 123,
      "mark": 6068218.7149797,
      "net": 6068095.7149797
    },
    "ETH": {
      "asset": "ETH",
      "position": 123,
      "average": 1,
      "price": 3260.28875758,
      "cost": 123,
      "mark": 401015.51718234003,
      "net": 400892.51718234003
    }
  },
  {
    "totalCost": 246,
    "totalMark": 6469234.23216204,
    "totalNet": 6468988.23216204
  }
]
```
