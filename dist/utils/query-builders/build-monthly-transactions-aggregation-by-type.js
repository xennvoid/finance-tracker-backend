"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMonthlyTransactionsAggregationByType = void 0;
const buildMonthlyTransactionsAggregationByType = (userId, cardId, type, startDate, endDate) => {
    return [
        {
            $match: {
                card: cardId,
                user: userId,
                createdAt: { $gte: startDate, $lte: endDate },
                type,
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                    type: '$type',
                },
                total: { $sum: '$amount' },
            },
        },
        {
            $project: {
                _id: 0,
                year: '$_id.year',
                month: '$_id.month',
                type: { $ifNull: ['$_id.type', type] },
                total: 1,
            },
        },
        {
            $sort: {
                year: 1,
                month: 1,
            },
        },
    ];
};
exports.buildMonthlyTransactionsAggregationByType = buildMonthlyTransactionsAggregationByType;
