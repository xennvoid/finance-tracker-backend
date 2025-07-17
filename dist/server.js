"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const PORT = process.env.PORT || 5000;
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => {
    console.log('DB Connected!');
    app_1.default.listen(PORT, () => {
        console.log(`Example app listening on port http://localhost:${PORT}`);
    });
    app_1.default.get('/api/hello', (req, res) => {
        res.send('Hello from Express!');
    });
})
    .catch(console.error);
