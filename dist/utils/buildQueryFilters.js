"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildQueryFilters = void 0;
const buildQueryFilters = (query, allowedFilterKeys) => {
    const reservedKeys = ['limit', 'page', 'sort'];
    const filters = {};
    for (const key in query) {
        if (!reservedKeys.includes(key) && allowedFilterKeys.includes(key)) {
            filters[key] = query[key];
        }
    }
    return filters;
};
exports.buildQueryFilters = buildQueryFilters;
