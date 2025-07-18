"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const transaction_routes_1 = __importDefault(require("./routes/transaction.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const card_routes_1 = __importDefault(require("./routes/card.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const auth_middleware_1 = __importDefault(require("./middleware/auth.middleware"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173', 'https://finance-tracker-frontend-beryl.vercel.app/'],
    credentials: true,
}));
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/api/auth', auth_routes_1.default);
app.use('/api/transactions', auth_middleware_1.default, transaction_routes_1.default);
app.use('/api/cards', auth_middleware_1.default, card_routes_1.default);
app.use('/api/users', auth_middleware_1.default, user_routes_1.default);
app.use(error_middleware_1.handleErrors);
exports.default = app;
