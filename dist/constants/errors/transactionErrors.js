"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRANSACTION_ERROR_TYPES = void 0;
exports.TRANSACTION_ERROR_TYPES = {
    NOT_FOUND: {
        statusCode: 404,
        errorCode: 'transaction_doesnt_exist',
        message: 'The specified transaction does not exist.',
    },
    NOT_RECEIPT: {
        statusCode: 422,
        errorCode: 'not_a_receipt',
        message: 'Image is not a receipt. Please upload a valid receipt.',
    },
    NO_IMAGE: {
        statusCode: 400,
        errorCode: 'no_image_uploaded',
        message: 'No image uploaded.',
    },
    UNSUPPORTED_FILE_TYPE: {
        statusCode: 415,
        errorCode: 'unsupported_file_type',
        message: 'Unsupported file type. Only JPEG, PNG, and WEBP images are allowed.',
    },
};
