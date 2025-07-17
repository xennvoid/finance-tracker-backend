"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transactions_controllers_1 = require("../controllers/transactions.controllers");
const upload_middleware_1 = require("../middleware/upload.middleware");
const router = express_1.default.Router();
router.post('/', transactions_controllers_1.createTransaction);
router.get('/', transactions_controllers_1.getUserTransactions);
router.get('/monthly-expenses', transactions_controllers_1.getMonthlyExpenses);
router.get('/monthly-incomes', transactions_controllers_1.getMonthlyIncomes);
router.get('/monthly-summary', transactions_controllers_1.getMonthlySummary);
router.get('/weekly-activity', transactions_controllers_1.getWeeklyActivity);
router.get('/:transactionId', transactions_controllers_1.getTransaction);
router.get('/cards/:cardId', transactions_controllers_1.getCardTransactions);
router.post('/ai-scan', upload_middleware_1.upload.single('image'), transactions_controllers_1.scanTransactionWithAI);
exports.default = router;
