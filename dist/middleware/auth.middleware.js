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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const user_model_1 = __importDefault(require("../models/user.model"));
const apiError_1 = require("../utils/apiError");
const errorTypes_1 = require("../constants/errors/errorTypes");
const jwt_1 = require("../utils/jwt");
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token) {
            throw new apiError_1.ApiError(errorTypes_1.ERROR_TYPES.FORBIDDEN.statusCode, errorTypes_1.ERROR_TYPES.FORBIDDEN.errorCode, errorTypes_1.ERROR_TYPES.FORBIDDEN.message);
        }
        const decoded = (0, jwt_1.verifyToken)(token, 'access');
        const userData = yield user_model_1.default.findById(decoded.userId);
        req.userId = userData === null || userData === void 0 ? void 0 : userData._id;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return next(new apiError_1.ApiError(errorTypes_1.ERROR_TYPES.INVALID_TOKEN.statusCode, errorTypes_1.ERROR_TYPES.INVALID_TOKEN.errorCode, errorTypes_1.ERROR_TYPES.INVALID_TOKEN.message));
        }
        next(error);
    }
});
exports.default = authMiddleware;
