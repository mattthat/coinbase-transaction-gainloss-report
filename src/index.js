#!/usr/bin/env node
const {
    inputFileData,
    csvParsing,
    assetPromises,
    csvRowToAssetPromise,
    assetPromiseOutcomeToAssetOutput,
    assetOutput
} = require("./core.js");

csvParsing(inputFileData, { columns: true, skip_empty_lines: true })
    .forEach(csvRow => csvRowToAssetPromise(csvRow));

Promise.allSettled(assetPromises)
    .then(outcomes => outcomes
            .filter(outcome => outcome.status === 'fulfilled')
            .forEach(fulfilledOutcome => assetPromiseOutcomeToAssetOutput(fulfilledOutcome)))
    .finally( () => console.log(JSON.stringify(assetOutput)));