"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assistantChatLimiter = exports.generalApiLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// Standard API Rate Limiter: 100 requests per 15 minutes per IP
exports.generalApiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too many requests. Please wait before submitting additional telemetry.',
    },
});
// Assistant Chat Rate Limiter: 30 requests per 1 minute per IP
exports.assistantChatLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too many assistant messages. Please pause for a moment before continuing dialogue.',
    },
});
