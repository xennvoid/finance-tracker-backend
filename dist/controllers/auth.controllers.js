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
exports.logout = exports.refreshToken = exports.register = exports.login = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const apiError_1 = require("../utils/apiError");
const errorTypes_1 = require("../constants/errors/errorTypes");
const jwt_1 = require("../utils/jwt");
const userErrors_1 = require("../constants/errors/userErrors");
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            throw new apiError_1.ApiError(errorTypes_1.ERROR_TYPES.MISSING_FIELDS.statusCode, errorTypes_1.ERROR_TYPES.MISSING_FIELDS.errorCode, errorTypes_1.ERROR_TYPES.MISSING_FIELDS.message);
        }
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            throw new apiError_1.ApiError(errorTypes_1.ERROR_TYPES.USER_NOT_FOUND.statusCode, errorTypes_1.ERROR_TYPES.USER_NOT_FOUND.errorCode, errorTypes_1.ERROR_TYPES.USER_NOT_FOUND.message);
        }
        const isMatch = yield user.isValidPassword(password);
        if (!isMatch) {
            throw new apiError_1.ApiError(errorTypes_1.ERROR_TYPES.WRONG_PASSWORD.statusCode, errorTypes_1.ERROR_TYPES.WRONG_PASSWORD.errorCode, errorTypes_1.ERROR_TYPES.WRONG_PASSWORD.message);
        }
        const accessToken = (0, jwt_1.generateToken)(user._id.toString(), 'access');
        const refreshToken = (0, jwt_1.generateToken)(user._id.toString(), 'refresh');
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            path: '/',
        });
        res.status(200).json({
            message: 'Login successful.',
            data: {
                accessToken,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                userName: user.userName,
                country: user.country,
                dateOfBirth: user.dateOfBirth,
            },
        });
    }
    catch (err) {
        return next(err);
    }
});
exports.login = login;
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, firstName, lastName } = req.body;
    try {
        if (!email || !password || !firstName || !lastName) {
            throw new apiError_1.ApiError(errorTypes_1.ERROR_TYPES.MISSING_FIELDS.statusCode, errorTypes_1.ERROR_TYPES.MISSING_FIELDS.errorCode, errorTypes_1.ERROR_TYPES.MISSING_FIELDS.message);
        }
        const existingUser = yield user_model_1.default.findOne({ email });
        if (existingUser)
            throw new apiError_1.ApiError(userErrors_1.USER_ERROR_TYPES.ALREADY_EXISTS.statusCode, userErrors_1.USER_ERROR_TYPES.ALREADY_EXISTS.errorCode, userErrors_1.USER_ERROR_TYPES.ALREADY_EXISTS.message);
        const newUser = new user_model_1.default({ email, firstName, lastName, password });
        yield newUser.save();
        res.status(200).json({ message: 'Registered successfully.' });
    }
    catch (err) {
        return next(err);
    }
});
exports.register = register;
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            throw new apiError_1.ApiError(errorTypes_1.ERROR_TYPES.NO_REFRESH_TOKEN.statusCode, errorTypes_1.ERROR_TYPES.NO_REFRESH_TOKEN.errorCode, errorTypes_1.ERROR_TYPES.NO_REFRESH_TOKEN.message);
        }
        const payload = (0, jwt_1.verifyToken)(refreshToken, 'refresh');
        const accessToken = (0, jwt_1.generateToken)(payload.userId, 'access');
        res.status(200).json({ message: 'Token refreshed.', data: { accessToken } });
    }
    catch (err) {
        next(err);
    }
});
exports.refreshToken = refreshToken;
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
        });
        res.status(200).json({ message: 'Logged out' });
    }
    catch (err) {
        return next(err);
    }
});
exports.logout = logout;
