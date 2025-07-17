"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSortingQuery = void 0;
const validateSortingQuery = (sortData) => {
    if (typeof sortData === 'object' && sortData !== null && !Array.isArray(sortData)) {
        const validSortData = {};
        for (const [key, value] of Object.entries(sortData)) {
            if (value === 'asc' || value === 'desc') {
                validSortData[key] = value;
            }
        }
        return validSortData;
    }
    return {};
};
exports.validateSortingQuery = validateSortingQuery;
