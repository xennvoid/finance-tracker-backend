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
exports.updateUser = exports.checkFieldsAvailabilty = exports.getMe = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const apiError_1 = require("../utils/apiError");
const userErrors_1 = require("../constants/errors/userErrors");
const getMe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const user = yield user_model_1.default.findById(userId);
        if (!user) {
            throw new apiError_1.ApiError(userErrors_1.USER_ERROR_TYPES.NOT_FOUND.statusCode, userErrors_1.USER_ERROR_TYPES.NOT_FOUND.errorCode, userErrors_1.USER_ERROR_TYPES.NOT_FOUND.message);
        }
        res.status(200).json({
            data: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                userName: user.userName,
                country: user.country,
                dateOfBirth: user.dateOfBirth,
            },
            message: 'User retrieved successfully.',
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getMe = getMe;
const checkFieldsAvailabilty = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, userName } = req.body;
        const existingUsers = yield user_model_1.default.find({
            $or: [{ email }, { userName }],
        }).select('-password');
        let emailTaken = false;
        let userNameTaken = false;
        for (const user of existingUsers) {
            if (user.email === email && String(user._id) !== String(req.userId)) {
                emailTaken = true;
            }
            if (user.userName === userName && String(user._id) !== String(req.userId)) {
                userNameTaken = true;
            }
        }
        res.status(200).json({
            data: {
                email: !emailTaken,
                userName: !userNameTaken,
            },
            message: 'Fields availability checked successfully',
        });
    }
    catch (err) {
        next(err);
    }
});
exports.checkFieldsAvailabilty = checkFieldsAvailabilty;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findById(req.userId);
        if (!user) {
            throw new apiError_1.ApiError(userErrors_1.USER_ERROR_TYPES.NOT_FOUND.statusCode, userErrors_1.USER_ERROR_TYPES.NOT_FOUND.errorCode, userErrors_1.USER_ERROR_TYPES.NOT_FOUND.message);
        }
        // 🔒 Prevent email update if user is test@gmail.com
        if (user.email === 'test@gmail.com' && req.body.email && req.body.email !== user.email) {
            throw new apiError_1.ApiError(userErrors_1.USER_ERROR_TYPES.TEST_EMAIL_UPDATE_FORBIDDEN.statusCode, userErrors_1.USER_ERROR_TYPES.TEST_EMAIL_UPDATE_FORBIDDEN.errorCode, userErrors_1.USER_ERROR_TYPES.TEST_EMAIL_UPDATE_FORBIDDEN.message);
        }
        yield user_model_1.default.findByIdAndUpdate(req.userId, req.body);
        res.status(200).json({
            message: 'Profile updated successfully',
        });
    }
    catch (err) {
        next(err);
    }
});
exports.updateUser = updateUser;
