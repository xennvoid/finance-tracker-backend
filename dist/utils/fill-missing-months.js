"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fillMissingMonths = void 0;
const fillMissingMonths = (rawData, previousMonthAmount, type, currentYear, currentMonth) => {
    const result = [];
    for (let i = previousMonthAmount; i >= 0; i--) {
        const date = new Date(currentYear, currentMonth - i, 1);
        const year = date.getFullYear();
        const month = date.getMonth();
        const existing = rawData.find((e) => e.year === year && e.month === month + 1);
        result.push(existing ? Object.assign(Object.assign({}, existing), { month: existing.month - 1 }) : { total: 0, year, month, type });
    }
    return result;
};
exports.fillMissingMonths = fillMissingMonths;
