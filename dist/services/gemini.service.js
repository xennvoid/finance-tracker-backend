"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.geminiAI = void 0;
const genai_1 = require("@google/genai");
exports.geminiAI = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
