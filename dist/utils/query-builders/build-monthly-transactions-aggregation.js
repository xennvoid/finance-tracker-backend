"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMonthlyTransactionsAggregation = void 0;
const buildMonthlyTransactionsAggregation = (userId, cardId, startDate, endDate) => {
    return [
        {
            $match: {
                card: cardId,
                user: userId,
                createdAt: { $gte: startDate, $lte: endDate },
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                },
                income: {
                    $sum: {
                        $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0],
                    },
                },
                expense: {
                    $sum: {
                        $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0],
                    },
                },
            },
        },
        {
            $project: {
                _id: 0,
                year: '$_id.year',
                month: '$_id.month',
                income: 1,
                expense: 1,
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
exports.buildMonthlyTransactionsAggregation = buildMonthlyTransactionsAggregation;
