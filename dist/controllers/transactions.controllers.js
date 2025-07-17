"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeeklyActivity = exports.getMonthlySummary = exports.getMonthlyIncomes = exports.getMonthlyExpenses = exports.getUserTransactions = exports.getCardTransactions = exports.getTransaction = exports.scanTransactionWithAI = exports.createTransaction = void 0;
const transaction_model_1 = __importDefault(require("../models/transaction.model"));
const apiError_1 = require("../utils/apiError");
const errorTypes_1 = require("../constants/errors/errorTypes");
const card_model_1 = __importDefault(require("../models/card.model"));
const cardErrors_1 = require("../constants/errors/cardErrors");
const transactionErrors_1 = require("../constants/errors/transactionErrors");
const mongoose_1 = __importDefault(require("mongoose"));
const getPagination_1 = require("../utils/getPagination");
const validateSortingQuery_1 = require("../utils/validateSortingQuery");
const getPaginationObject_1 = require("../utils/getPaginationObject");
const transaction_1 = require("../utils/filter-builders/transaction");
const get_date_range_1 = require("../utils/get-date-range");
const build_monthly_transactions_aggregation_by_type_1 = require("../utils/query-builders/build-monthly-transactions-aggregation-by-type");
const fill_missing_months_1 = require("../utils/fill-missing-months");
const build_monthly_transactions_aggregation_1 = require("../utils/query-builders/build-monthly-transactions-aggregation");
const to_object_id_or_throw_1 = require("../utils/to-object-id-or-throw");
const gemini_service_1 = require("../services/gemini.service");
const createTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { cardId, description, text, date, amount, type } = req.body;
        if (!cardId || !description || !date || !amount || !type) {
            throw new apiError_1.ApiError(errorTypes_1.ERROR_TYPES.MISSING_FIELDS.statusCode, errorTypes_1.ERROR_TYPES.MISSING_FIELDS.errorCode, errorTypes_1.ERROR_TYPES.MISSING_FIELDS.message);
        }
        const userId = req.userId;
        const checkCard = yield card_model_1.default.findOneAndUpdate({ _id: cardId, user: userId }, { $inc: { balance: type === 'income' ? amount : -amount } }, { new: true, session, runValidators: true });
        if (!checkCard) {
            throw new apiError_1.ApiError(cardErrors_1.CARD_ERROR_TYPES.NOT_FOUND.statusCode, cardErrors_1.CARD_ERROR_TYPES.NOT_FOUND.errorCode, cardErrors_1.CARD_ERROR_TYPES.NOT_FOUND.message);
        }
        if (checkCard.balance < 0) {
            throw new apiError_1.ApiError(cardErrors_1.CARD_ERROR_TYPES.INSUFFICIENT_BALANCE.statusCode, cardErrors_1.CARD_ERROR_TYPES.INSUFFICIENT_BALANCE.errorCode, cardErrors_1.CARD_ERROR_TYPES.INSUFFICIENT_BALANCE.message);
        }
        const newTransaction = new transaction_model_1.default({
            user: userId,
            card: cardId,
            description,
            text,
            date,
            amount,
            type,
        });
        yield newTransaction.save({ session });
        yield session.commitTransaction();
        session.endSession();
        res.status(200).json({ message: 'Transaction created successfully.' });
    }
    catch (err) {
        yield session.abortTransaction();
        session.endSession();
        next(err);
    }
});
exports.createTransaction = createTransaction;
const scanTransactionWithAI = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file;
        if (!file) {
            throw new apiError_1.ApiError(transactionErrors_1.TRANSACTION_ERROR_TYPES.NO_IMAGE.statusCode, transactionErrors_1.TRANSACTION_ERROR_TYPES.NO_IMAGE.errorCode, transactionErrors_1.TRANSACTION_ERROR_TYPES.NO_IMAGE.message);
        }
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedImageTypes.includes(file.mimetype)) {
            throw new apiError_1.ApiError(transactionErrors_1.TRANSACTION_ERROR_TYPES.UNSUPPORTED_FILE_TYPE.statusCode, transactionErrors_1.TRANSACTION_ERROR_TYPES.UNSUPPORTED_FILE_TYPE.errorCode, transactionErrors_1.TRANSACTION_ERROR_TYPES.UNSUPPORTED_FILE_TYPE.message);
        }
        const base64Image = file.buffer.toString('base64');
        const mimeType = file.mimetype;
        const contents = [
            {
                inlineData: {
                    mimeType,
                    data: base64Image,
                },
            },
            {
                text: `You should analyze this image.
If this is a receipt, analyze it and create a json:
The description field is general information about the purchase. For example, if there is a list of some fruits, then write fruits, etc.
The amount field is the sum of all purchases in the receipt. It's only number value.
The text field is where you can describe what is indicated in the receipt in structured text. Include only the necessary information. For example, if there is some unnecessary text like "Thank you for your purchases", ignore it.
Only return valid JSON without explanation. 
If this is NOT a receipt, return:
{ "error": "NOT_RECEIPT" }`,
            },
        ];
        const response = yield gemini_service_1.geminiAI.models.generateContent({
            model: 'gemini-2.0-flash-lite',
            contents,
        });
        const text = response.text || '';
        const cleaned = text.replace(/^```json\s*|```$/g, '').trim();
        const parsed = JSON.parse(cleaned);
        if ((parsed === null || parsed === void 0 ? void 0 : parsed.error) === 'NOT_RECEIPT') {
            throw new apiError_1.ApiError(transactionErrors_1.TRANSACTION_ERROR_TYPES.NOT_RECEIPT.statusCode, transactionErrors_1.TRANSACTION_ERROR_TYPES.NOT_RECEIPT.errorCode, transactionErrors_1.TRANSACTION_ERROR_TYPES.NOT_RECEIPT.message);
        }
        res.status(200).json({ message: 'Receipt analyzed successfully!', data: parsed });
    }
    catch (err) {
        console.error('Gemini error:', err);
        next(err);
    }
});
exports.scanTransactionWithAI = scanTransactionWithAI;
const getTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { transactionId } = req.params;
        const userId = req.userId;
        const transaction = yield transaction_model_1.default.findOne({ _id: transactionId, user: userId });
        if (!transaction) {
            throw new apiError_1.ApiError(transactionErrors_1.TRANSACTION_ERROR_TYPES.NOT_FOUND.statusCode, transactionErrors_1.TRANSACTION_ERROR_TYPES.NOT_FOUND.errorCode, transactionErrors_1.TRANSACTION_ERROR_TYPES.NOT_FOUND.message);
        }
        res.status(200).json({ message: 'Data retrieved successfully.', data: transaction });
    }
    catch (err) {
        next(err);
    }
});
exports.getTransaction = getTransaction;
const getCardTransactions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cardId } = req.params;
        const userId = req.userId;
        const card = yield card_model_1.default.findOne({ _id: cardId, user: userId });
        if (!card) {
            throw new apiError_1.ApiError(cardErrors_1.CARD_ERROR_TYPES.NOT_FOUND.statusCode, cardErrors_1.CARD_ERROR_TYPES.NOT_FOUND.errorCode, cardErrors_1.CARD_ERROR_TYPES.NOT_FOUND.message);
        }
        const transactions = yield transaction_model_1.default.find({ card: cardId });
        if (transactions.length === 0) {
            res.status(200).json({ success: true, message: 'You have 0 transactions.', data: [] });
            return;
        }
        res.json({ message: 'Data retrieved successfully.', data: transactions });
    }
    catch (err) {
        next(err);
    }
});
exports.getCardTransactions = getCardTransactions;
const getUserTransactions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { page, limit, skip } = (0, getPagination_1.getPagination)(req.query);
        const sortQuery = (0, validateSortingQuery_1.validateSortingQuery)(req.query.sort);
        const filters = Object.assign({ user: userId }, (0, transaction_1.transactionQueryFilterBuilder)(req.query));
        const [data, total] = yield Promise.all([
            transaction_model_1.default.find(filters)
                .populate('card', 'number currency -_id')
                .sort(sortQuery)
                .skip(skip)
                .limit(limit),
            transaction_model_1.default.countDocuments(filters),
        ]);
        const pagination = (0, getPaginationObject_1.getPaginationObject)(total, page, limit);
        if (data.length === 0) {
            res.status(200).json({ success: true, message: 'No data found.', data: [] });
            return;
        }
        res.status(200).json({
            message: 'Data retrieved successfully.',
            data,
            pagination,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getUserTransactions = getUserTransactions;
const getMonthlyExpenses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const cardId = (0, to_object_id_or_throw_1.toObjectIdOrThrow)(req.query.cardId);
        const PREV_MONTHS_AMOUNT = Number(req.query.limit) || 0;
        const { startDate, endDate, currentYear, currentMonth } = (0, get_date_range_1.getDateRange)(PREV_MONTHS_AMOUNT);
        const pipeline = (0, build_monthly_transactions_aggregation_by_type_1.buildMonthlyTransactionsAggregationByType)(userId, cardId, 'expense', startDate, endDate);
        const monthlyExpenses = yield transaction_model_1.default.aggregate(pipeline);
        if (monthlyExpenses.length === 0) {
            res.status(200).json({ success: true, message: 'No data found.', data: [] });
            return;
        }
        const filledMonthlyExpenses = (0, fill_missing_months_1.fillMissingMonths)(monthlyExpenses, PREV_MONTHS_AMOUNT, 'expense', currentYear, currentMonth);
        res.status(200).json({
            message: 'Data retrieved successfully.',
            data: filledMonthlyExpenses,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getMonthlyExpenses = getMonthlyExpenses;
const getMonthlyIncomes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const cardId = (0, to_object_id_or_throw_1.toObjectIdOrThrow)(req.query.cardId);
        const PREV_MONTHS_AMOUNT = Number(req.query.limit) || 0;
        const { startDate, endDate, currentYear, currentMonth } = (0, get_date_range_1.getDateRange)(PREV_MONTHS_AMOUNT);
        const pipeline = (0, build_monthly_transactions_aggregation_by_type_1.buildMonthlyTransactionsAggregationByType)(userId, cardId, 'income', startDate, endDate);
        const monthlyExpenses = yield transaction_model_1.default.aggregate(pipeline);
        if (monthlyExpenses.length === 0) {
            res.status(200).json({ success: true, message: 'No data found.', data: [] });
            return;
        }
        const filledMonthlyExpenses = (0, fill_missing_months_1.fillMissingMonths)(monthlyExpenses, PREV_MONTHS_AMOUNT, 'income', currentYear, currentMonth);
        res.status(200).json({
            message: 'Data retrieved successfully.',
            data: filledMonthlyExpenses,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getMonthlyIncomes = getMonthlyIncomes;
const getMonthlySummary = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const cardId = (0, to_object_id_or_throw_1.toObjectIdOrThrow)(req.query.cardId);
        const { startDate, endDate } = (0, get_date_range_1.getDateRange)(0);
        const pipeline = (0, build_monthly_transactions_aggregation_1.buildMonthlyTransactionsAggregation)(userId, cardId, startDate, endDate);
        const monthlySummary = yield transaction_model_1.default.aggregate(pipeline);
        if (monthlySummary.length === 0) {
            res.status(200).json({ success: true, message: 'No data found.', data: [] });
            return;
        }
        res.status(200).json({
            message: 'Data retrieved successfully.',
            data: monthlySummary,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getMonthlySummary = getMonthlySummary;
const getWeeklyActivity = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const cardId = (0, to_object_id_or_throw_1.toObjectIdOrThrow)(req.query.cardId);
        const today = new Date();
        const startDate = new Date();
        startDate.setDate(today.getDate() - 6);
        startDate.setUTCHours(0, 0, 0, 0);
        const transactions = yield transaction_model_1.default.aggregate([
            {
                $match: {
                    user: userId,
                    card: cardId,
                    createdAt: {
                        $gte: startDate,
                        $lte: today,
                    },
                },
            },
            {
                $addFields: {
                    dateOnly: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                    },
                },
            },
            {
                $group: {
                    _id: {
                        date: '$dateOnly',
                        type: '$type',
                    },
                    total: { $sum: '$amount' },
                },
            },
            {
                $group: {
                    _id: '$_id.date',
                    income: {
                        $sum: {
                            $cond: [{ $eq: ['$_id.type', 'income'] }, '$total', 0],
                        },
                    },
                    expense: {
                        $sum: {
                            $cond: [{ $eq: ['$_id.type', 'expense'] }, '$total', 0],
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    date: '$_id',
                    income: 1,
                    expense: 1,
                },
            },
            {
                $sort: { date: 1 },
            },
        ]);
        if (transactions.length === 0) {
            res.status(200).json({ success: true, message: 'No data found.', data: [] });
            return;
        }
        const transactionsWithDayLabels = transactions.map((entry) => {
            const dateObj = new Date(entry.date);
            const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
            return Object.assign(Object.assign({}, entry), { day: weekday });
        });
        const current = new Date(startDate);
        const dates = [];
        while (current <= today) {
            dates.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }
        const filledTransactions = dates.map((date) => {
            const formattedDate = date.toISOString().split('T')[0];
            const transaction = transactionsWithDayLabels.find((transaction) => transaction.date === formattedDate);
            if (transaction)
                return Object.assign(Object.assign({}, transaction), { day: new Date(formattedDate).toLocaleDateString('en-US', { weekday: 'short' }) });
            return {
                income: 0,
                expense: 0,
                date: formattedDate,
                day: new Date(formattedDate).toLocaleDateString('en-US', { weekday: 'short' }),
            };
        });
        res.status(200).json({
            message: 'Data retrieved successfully.',
            data: filledTransactions,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getWeeklyActivity = getWeeklyActivity;
