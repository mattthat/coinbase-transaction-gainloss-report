#!/usr/bin/env node
const {
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
} = require("./core.js");

csvParsing(inputFileData, { columns: true, skip_empty_lines: true })
    .forEach(csvRow => transformCsvRowToAssetPromise(csvRow));

Promise.allSettled(assetPromises)
    .then(settledPromises => settledPromises
        .filter(settledPromise => settledPromise.status === 'fulfilled')
        .forEach(settledAndFulFilledPromise =>
            transformSettledAndFulFilledAssetPromiseToAssetOutputElementMapEntry(
                settledAndFulFilledPromise)))
    .then( () => produceAssetOutput())
    .finally( () => console.log(JSON.stringify(assetOutput)));