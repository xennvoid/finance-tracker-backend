"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleErrors = void 0;
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = __importDefault(require("mongoose"));
const errorTypes_1 = require("../constants/errors/errorTypes");
const mongooseErrors_1 = require("../constants/errors/mongooseErrors");
const handleErrors = (err, req, res, next) => {
    let statusCode = err.statusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
    const errorResponse = {
        error: {
            errorCode: err.errorCode || errorTypes_1.ERROR_TYPES.INTERNAL_SERVER_ERROR.errorCode,
            message: err.message || errorTypes_1.ERROR_TYPES.INTERNAL_SERVER_ERROR.message,
            details: null,
        },
    };
    if (err instanceof mongoose_1.default.Error.ValidationError) {
        statusCode = mongooseErrors_1.MONGOOSE_ERROR_TYPES.VALIDATION_ERROR.statusCode;
        errorResponse.error.errorCode = mongooseErrors_1.MONGOOSE_ERROR_TYPES.VALIDATION_ERROR.errorCode;
        errorResponse.error.message = mongooseErrors_1.MONGOOSE_ERROR_TYPES.VALIDATION_ERROR.message;
        errorResponse.error.details = Object.values(err.errors).map((e) => ({
            field: e.path,
            message: e.message,
        }));
    }
    else if (err instanceof mongoose_1.default.Error.CastError) {
        statusCode = mongooseErrors_1.MONGOOSE_ERROR_TYPES.CAST_ERROR.statusCode;
        errorResponse.error.errorCode = mongooseErrors_1.MONGOOSE_ERROR_TYPES.CAST_ERROR.errorCode;
        errorResponse.error.message = `${mongooseErrors_1.MONGOOSE_ERROR_TYPES.CAST_ERROR.errorCode}: ${err.path}`;
    }
    else if (err.code === 11000) {
        statusCode = mongooseErrors_1.MONGOOSE_ERROR_TYPES.DUPLICATE_ERROR.statusCode;
        errorResponse.error.errorCode = mongooseErrors_1.MONGOOSE_ERROR_TYPES.DUPLICATE_ERROR.errorCode;
        if (err.keyValue)
            errorResponse.error.message = `Duplicate value for field: ${Object.keys(err.keyValue).join(', ')}`;
        else
            errorResponse.error.message = 'Key duplication';
    }
    res.status(statusCode).json(errorResponse);
};
exports.handleErrors = handleErrors;
