"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginationObject = void 0;
const getPaginationObject = (total, page, limit) => {
    return { total, page, pageSize: limit, totalPages: Math.ceil(total / limit) };
};
exports.getPaginationObject = getPaginationObject;
