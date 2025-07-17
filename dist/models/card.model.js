"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const cardSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
    number: { type: String, required: true },
    holderFirstName: { type: String, required: true },
    holderLastName: { type: String, required: true },
    availableUntil: { type: Date },
    balance: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    mainBackgroundColor: { type: String },
    secondaryBackgroundColor: { type: String },
    mainTextColor: { type: String },
    secondaryTextColor: { type: String },
}, { timestamps: true });
const Card = (0, mongoose_1.model)('Card', cardSchema);
exports.default = Card;
