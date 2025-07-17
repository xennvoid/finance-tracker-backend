"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const transactionSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
    card: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'Card' },
    description: { type: String, required: true },
    text: { type: String },
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    type: { type: String, required: true, enum: ['expense', 'income'], default: 'expense' },
}, { timestamps: true });
const Transaction = (0, mongoose_1.model)('Transaction', transactionSchema);
exports.default = Transaction;
