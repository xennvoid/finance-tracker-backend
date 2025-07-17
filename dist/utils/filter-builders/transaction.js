"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionQueryFilterBuilder = void 0;
const buildQueryFilters_1 = require("../buildQueryFilters");
const transactionQueryFilterBuilder = (query) => {
    const filters = (0, buildQueryFilters_1.buildQueryFilters)(query, ['type']);
    if (filters.type && filters.type !== 'all') {
        filters.type = filters.type;
    }
    else {
        delete filters.type;
    }
    return filters;
};
exports.transactionQueryFilterBuilder = transactionQueryFilterBuilder;
