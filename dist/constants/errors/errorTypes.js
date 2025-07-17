"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_TYPES = void 0;
exports.ERROR_TYPES = {
    ITEM_ALREADY_EXISTS: {
        statusCode: 409,
        errorCode: 'item_already_exists',
        message: 'Item already exists.',
    },
    USER_NOT_FOUND: {
        statusCode: 404,
        errorCode: 'user_not_found',
        message: 'No account found with this email.',
    },
    WRONG_PASSWORD: {
        statusCode: 401,
        errorCode: 'wrong_password',
        message: 'Incorrect password.',
    },
    FORBIDDEN: {
        statusCode: 403,
        errorCode: 'forbidden',
        message: 'You do not have permission to perform this action.',
    },
    NOT_FOUND: {
        statusCode: 404,
        errorCode: 'not_found',
        message: 'Requested resource not found.',
    },
    MISSING_FIELDS: {
        statusCode: 400,
        errorCode: 'missing_required_fields',
        message: 'Not all fields provided.',
    },
    INTERNAL_SERVER_ERROR: {
        statusCode: 500,
        errorCode: 'internal_server_error',
        message: 'An unexpected error occurred.',
    },
    INVALID_TOKEN: {
        statusCode: 401,
        errorCode: 'invalid_token',
        message: 'The provided token is invalid.',
    },
    NO_REFRESH_TOKEN: {
        statusCode: 401,
        errorCode: 'no_refresh_token_provided',
        message: 'No refresh token provided.',
    },
};
