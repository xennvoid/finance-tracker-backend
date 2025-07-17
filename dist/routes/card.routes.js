"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cards_controllers_1 = require("../controllers/cards.controllers");
const router = express_1.default.Router();
router.post('/', cards_controllers_1.addNewCard);
router.delete('/:cardId', cards_controllers_1.deleteCard);
router.get('/', cards_controllers_1.getCards);
exports.default = router;
