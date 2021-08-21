let iteration = 0, totalMark = 0, totalCost = 0;
const costs = [], positions = [], assets = [],
    assetPromises = [], assetOutput = [], assetOutputMapElement = {},
    transactions = process.argv[2],
    fileSystem = require('fs'),
    csvParsing = require('csv-parse/lib/sync'),
    cryptoPricing = require('crypto-price'),
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
    transformCsvRowToAssetPromise = (csvRow) => {
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
    transformSettledAndFulFilledAssetPromiseToAssetOutputElementMapEntry = (result) => {
        const asset = result.value.base,
            price = parseFloat(result.value.price),
            position = positions[asset],
            cost = costs[asset];

        iteration++;
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
    produceAssetOutput = () => {
        assetOutput.push(assetOutputMapElement);
        assetOutput.push({
            totalCost, totalMark,
            totalNet: totalMark - totalCost
        });
    },
    inputFileData = fileSystem.readFileSync(transactions).toString();

module.exports = {
    assets,
    positions,
    costs,
    assetOutput,
    assetOutputMapElement,
    inputFileData,
    csvParsing,
    assetPromises,
    transformCsvRowToAssetPromise,
    transformSettledAndFulFilledAssetPromiseToAssetOutputElementMapEntry,
    produceAssetOutput
}