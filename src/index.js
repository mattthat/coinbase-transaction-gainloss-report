#!/usr/bin/env node
const {
    assetOutput,
    inputFileData,
    csvParsing,
    assetPromises,
    transformCsvRowToAssetPromise,
    transformFulFilledAssetPromiseToAssetOutputMapEntry,
    produceAssetOutput
} = require("./core.js");

csvParsing(inputFileData, { columns: true, skip_empty_lines: true })
    .forEach(csvRow => transformCsvRowToAssetPromise(csvRow));

Promise.allSettled(assetPromises).then(settledPromises => settledPromises
    .filter(settledPromise => settledPromise.status === 'fulfilled')
    .forEach(settledAndFulFilledPromise =>
        transformFulFilledAssetPromiseToAssetOutputMapEntry(settledAndFulFilledPromise)))
    .then( () => produceAssetOutput())
    .finally( () => console.log(JSON.stringify(assetOutput)));
