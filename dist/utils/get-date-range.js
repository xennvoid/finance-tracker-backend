"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDateRange = void 0;
const getDateRange = (previousMonthsAmount) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const startMonth = currentMonth - previousMonthsAmount;
    const startDate = new Date(currentYear, startMonth, 1);
    const endDate = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);
    return { startDate, endDate, currentYear, currentMonth };
};
exports.getDateRange = getDateRange;
