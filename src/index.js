#!/usr/bin/env node
const {
    csvParsing,
    transformCsvRowToAssetSettlement,
    transformSettlementToAssetAnalysis,
    settleAssets,
    provideAssetAnalysis
} = require("./core.js");

csvParsing()
    .forEach(csvRow =>
        transformCsvRowToAssetSettlement(csvRow));

settleAssets()
    .then(settled => settled
        .filter(settlement => settlement.status === 'fulfilled')
        .forEach(fulfilledSettlement =>
            transformSettlementToAssetAnalysis(fulfilledSettlement)))
    .finally( () => console.log(JSON.stringify(provideAssetAnalysis())));
