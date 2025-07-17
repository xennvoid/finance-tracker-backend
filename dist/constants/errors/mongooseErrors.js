"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MONGOOSE_ERROR_TYPES = void 0;
exports.MONGOOSE_ERROR_TYPES = {
    CAST_ERROR: {
        statusCode: 400,
        errorCode: 'invalid_format',
        message: 'Invalid format.',
    },
    VALIDATION_ERROR: {
        statusCode: 400,
        errorCode: 'validation_error',
        message: 'Invalid data input.',
    },
    DUPLICATE_ERROR: {
        statusCode: 409,
        errorCode: 'duplicate_error',
        message: 'You are duplicating keys.',
    },
};
