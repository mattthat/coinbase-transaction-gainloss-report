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
$ src/index.js example-report.csv
```
```json
[
  {
    "asset": "BTC",
    "position": 123,
    "average": 1,
    "price": 48933.2163632,
    "cost": 123,
    "mark": 6018785.6126736,
    "net": 6018662.6126736
  },
  {
    "asset": "ETH",
    "position": 123,
    "average": 1,
    "price": 3221.49694387,
    "cost": 123,
    "mark": 396244.12409601,
    "net": 396121.12409601
  },
  {
    "totalCost": 246,
    "totalMark": 6415029.73676961,
    "totalNet": 6414783.73676961
  }
]
```
