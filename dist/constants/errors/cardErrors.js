"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CARD_ERROR_TYPES = void 0;
exports.CARD_ERROR_TYPES = {
    ALREADY_EXISTS: {
        statusCode: 409,
        errorCode: 'card_already_exists',
        message: 'You have already added card with this number.',
    },
    NOT_FOUND: {
        statusCode: 404,
        errorCode: 'card_doesnt_exist',
        message: 'The specified card does not exist.',
    },
    NO_CARD_ID: {
        statusCode: 400,
        errorCode: 'no_card_id_provided',
        message: 'No card id provided.',
    },
    INSUFFICIENT_BALANCE: {
        statusCode: 400,
        errorCode: 'insufficient_balance',
        message: 'You cannot spend more than your current balance.',
    },
};
