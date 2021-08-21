let totalMark = 0, totalCost = 0;
const costs = {}, positions = {}, assets = [],
    assetPromises = [], assetOutputMapElement = {},
    transactions = process.argv[2],
    fileSystem = require('fs'),
    csvParse = require('csv-parse/lib/sync'),
    cryptoPricing = require('crypto-price'),
    csvParsing = () => {
        return csvParse(inputFileData,
            { columns: true, skip_empty_lines: true });
    },
    trackAsset = (asset) => {
        if (assets.indexOf(asset) === -1) {
            assets.push(asset);
            assetPromises.push(cryptoPricing.getCryptoPrice('USD', asset));
        }
        if (!costs[asset]) costs[asset] = 0;
        if (!positions[asset]) positions[asset] = 0;
    },
    buyAsset = (asset, subtotal, transacted) => {
        trackAsset(asset);
        costs[asset] += parseFloat(subtotal);
        positions[asset] += parseFloat(transacted)
    },
    sendAsset = (asset, transacted) => {
        positions[asset] -= parseFloat(transacted);
    },
    sellAsset = (asset, subtotal, transacted) => {
        costs[asset] -= parseFloat(subtotal);
        positions[asset] -= parseFloat(transacted);
    },
    receiveAsset = (asset, transacted) => {
        trackAsset(asset);
        positions[asset] += parseFloat(transacted)
    },
    rewardAssetIncome = (asset, subtotal, transacted) => {
        positions[asset] += parseFloat(transacted);
    },
    transformCsvRowToAssetSettlement = (csvRow) => {
        const asset = csvRow['Asset'], transactionType = csvRow['Transaction Type'],
            subtotal = csvRow['USD Subtotal'], transacted = csvRow['Quantity Transacted'];
        if (transactionType === 'Buy') {
            buyAsset(asset, subtotal, transacted);
        } else if (transactionType === 'Send') {
            sendAsset(asset, transacted);
        } else if (transactionType === 'Sell') {
            sellAsset(asset, subtotal, transacted);
        } else if (transactionType === 'Receive') {
            receiveAsset(asset, transacted);
        } else if (transactionType === 'Rewards Income') {
            rewardAssetIncome(asset, subtotal, transacted);
        }
    },
    transformSettlementToAssetAnalysis = (result) => {
        const asset = result.value.base,
            price = parseFloat(result.value.price),
            position = positions[asset],
            cost = costs[asset];

        totalMark += (price * position);
        totalCost += cost;

        assetOutputMapElement[asset] = {
            asset, position,
            average: cost / position,
            price, cost,
            mark: price * position,
            net: (price * position) - cost,
        };
        return assetOutputMapElement[asset];
    },
    settleAssets = () => {
        return Promise.allSettled(assetPromises);
    }
    provideTotals = () => {
        return {
            totalCost, totalMark,
            totalNet: totalMark - totalCost
        }
    },
    provideReference = () => {
        return {
            assets,
            positions,
            costs
        }
    },
    provideAssetOutputMapElement = () => {
        return assetOutputMapElement;
    },
    provideAssetAnalysis = () => {
        return {
            reference: provideReference(),
            assets: provideAssetOutputMapElement(),
            totals: provideTotals()
        };
    },
    inputFileData = fileSystem.readFileSync(transactions).toString();

module.exports = {
    csvParsing,
    settleAssets,
    transformCsvRowToAssetSettlement,
    transformSettlementToAssetAnalysis,
    provideAssetAnalysis,
}