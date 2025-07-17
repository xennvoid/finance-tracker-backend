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
exports.getCards = exports.deleteCard = exports.addNewCard = void 0;
const card_model_1 = __importDefault(require("../models/card.model"));
const apiError_1 = require("../utils/apiError");
const errorTypes_1 = require("../constants/errors/errorTypes");
const cardErrors_1 = require("../constants/errors/cardErrors");
const getPagination_1 = require("../utils/getPagination");
const validateSortingQuery_1 = require("../utils/validateSortingQuery");
const getPaginationObject_1 = require("../utils/getPaginationObject");
const addNewCard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { number, holderFirstName, holderLastName, availableUntil, balance, currency } = req.body;
        console.log(req.body);
        if (!number ||
            !holderFirstName ||
            !holderLastName ||
            !availableUntil ||
            balance == null ||
            !currency) {
            throw new apiError_1.ApiError(errorTypes_1.ERROR_TYPES.MISSING_FIELDS.statusCode, errorTypes_1.ERROR_TYPES.MISSING_FIELDS.errorCode, errorTypes_1.ERROR_TYPES.MISSING_FIELDS.message);
        }
        const userId = req.userId; // Extracted from authMiddleware
        const existingCard = yield card_model_1.default.findOne({ user: userId, number });
        if (existingCard) {
            throw new apiError_1.ApiError(cardErrors_1.CARD_ERROR_TYPES.ALREADY_EXISTS.statusCode, cardErrors_1.CARD_ERROR_TYPES.ALREADY_EXISTS.errorCode, cardErrors_1.CARD_ERROR_TYPES.ALREADY_EXISTS.message);
        }
        const newCard = new card_model_1.default({
            user: userId,
            number,
            holderFirstName,
            holderLastName,
            balance,
            availableUntil,
            currency,
        });
        yield newCard.save();
        res.status(201).json({ message: 'Card added successfully.' });
    }
    catch (err) {
        next(err);
    }
});
exports.addNewCard = addNewCard;
const deleteCard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cardId } = req.params;
        if (!cardId) {
            throw new apiError_1.ApiError(cardErrors_1.CARD_ERROR_TYPES.NO_CARD_ID.statusCode, cardErrors_1.CARD_ERROR_TYPES.NO_CARD_ID.errorCode, cardErrors_1.CARD_ERROR_TYPES.NO_CARD_ID.message);
        }
        const userId = req.userId;
        const existingCard = yield card_model_1.default.deleteOne({ _id: cardId, user: userId });
        if (existingCard.deletedCount === 0) {
            throw new apiError_1.ApiError(cardErrors_1.CARD_ERROR_TYPES.NOT_FOUND.statusCode, cardErrors_1.CARD_ERROR_TYPES.NOT_FOUND.errorCode, cardErrors_1.CARD_ERROR_TYPES.NOT_FOUND.message);
        }
        res.status(200).json({ message: 'Transaction deleted successfully' });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteCard = deleteCard;
const getCards = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { page, limit, skip } = (0, getPagination_1.getPagination)(req.query);
        const sortQuery = (0, validateSortingQuery_1.validateSortingQuery)(req.query.sort);
        const [data, total] = yield Promise.all([
            card_model_1.default.find({ user: userId }).select('-__v -user').sort(sortQuery).skip(skip).limit(limit),
            card_model_1.default.countDocuments({ user: userId }),
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
exports.getCards = getCards;
