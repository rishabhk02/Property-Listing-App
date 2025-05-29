"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const environment_1 = require("../config/environment");
exports.apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: environment_1.config.rateLimit.windowMs, // 15 minutes
    max: environment_1.config.rateLimit.maxRequests, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
});
//# sourceMappingURL=rateLimit.js.map