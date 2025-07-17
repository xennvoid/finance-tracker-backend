"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const apiError_1 = require("./apiError");
const errorTypes_1 = require("../constants/errors/errorTypes");
const ACCESS_SECRET = process.env.AUTH_SECRET || 'secret123123';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'secret21312';
const ACCESS_EXPIRES_IN = '1h';
const REFRESH_EXPIRES_IN = '1d';
const generateToken = (userId, type) => {
    const SECRET = type === 'access' ? ACCESS_SECRET : REFRESH_SECRET;
    const EXPIRES = type === 'access' ? ACCESS_EXPIRES_IN : REFRESH_EXPIRES_IN;
    return jsonwebtoken_1.default.sign({ userId }, SECRET, { expiresIn: EXPIRES });
};
exports.generateToken = generateToken;
const verifyToken = (token, type) => {
    const SECRET = type === 'access' ? ACCESS_SECRET : REFRESH_SECRET;
    try {
        return jsonwebtoken_1.default.verify(token, SECRET);
    }
    catch (err) {
        throw new apiError_1.ApiError(errorTypes_1.ERROR_TYPES.INVALID_TOKEN.statusCode, errorTypes_1.ERROR_TYPES.INVALID_TOKEN.errorCode, errorTypes_1.ERROR_TYPES.INVALID_TOKEN.message);
    }
};
exports.verifyToken = verifyToken;
