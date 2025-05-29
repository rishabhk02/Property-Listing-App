"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middlewares/auth");
const rateLimit_1 = require("../middlewares/rateLimit");
const authRouter = (0, express_1.Router)();
authRouter.post('/register', rateLimit_1.apiLimiter, authController_1.register);
authRouter.post('/login', rateLimit_1.apiLimiter, authController_1.login);
authRouter.get('/profile', rateLimit_1.apiLimiter, auth_1.authenticate, authController_1.getProfile);
authRouter.get('/find-user', rateLimit_1.apiLimiter, auth_1.authenticate, authController_1.findUserByEmail);
exports.default = authRouter;
//# sourceMappingURL=auth.js.map