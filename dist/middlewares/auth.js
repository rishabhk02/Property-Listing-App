"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const environment_1 = require("../config/environment");
const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
            return;
        }
        const payload = jsonwebtoken_1.default.verify(token, environment_1.config.jwtSecret);
        const user = await User_1.User.findById(payload.userId).select('-password');
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Invalid token or expired token.'
            });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid token or expired token'
        });
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.js.map