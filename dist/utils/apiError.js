"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    constructor(statusCode, errorCode, message, code, details) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.code = code;
        this.details = details;
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}
exports.ApiError = ApiError;
