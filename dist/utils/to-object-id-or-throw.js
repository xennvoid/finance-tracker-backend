"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toObjectIdOrThrow = toObjectIdOrThrow;
const mongoose_1 = __importDefault(require("mongoose"));
function toObjectIdOrThrow(id) {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid ObjectId: ${id}`);
    }
    return new mongoose_1.default.Types.ObjectId(id);
}
