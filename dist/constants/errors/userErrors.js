"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_ERROR_TYPES = void 0;
exports.USER_ERROR_TYPES = {
    ALREADY_EXISTS: {
        statusCode: 409,
        errorCode: 'user_already_exists',
        message: 'User with this email already exists.',
    },
    NOT_FOUND: {
        statusCode: 404,
        errorCode: 'user_not_found',
        message: 'User not found.',
    },
};
