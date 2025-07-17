"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_controllers_1 = require("../controllers/users.controllers");
const router = express_1.default.Router();
router.get('/get-me', users_controllers_1.getMe);
router.post('/check-fields-availability', users_controllers_1.checkFieldsAvailabilty);
router.patch('/', users_controllers_1.updateUser);
exports.default = router;
