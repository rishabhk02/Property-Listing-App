"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const recommendationController_1 = require("../controllers/recommendationController");
const auth_1 = require("../middlewares/auth");
const rateLimit_1 = require("../middlewares/rateLimit");
const recommendationRouter = (0, express_1.Router)();
recommendationRouter.post('/', rateLimit_1.apiLimiter, auth_1.authenticate, recommendationController_1.recommendProperty);
recommendationRouter.get('/received', rateLimit_1.apiLimiter, auth_1.authenticate, recommendationController_1.getReceivedRecommendations);
recommendationRouter.get('/sent', rateLimit_1.apiLimiter, auth_1.authenticate, recommendationController_1.getSentRecommendations);
recommendationRouter.patch('/:id/read', rateLimit_1.apiLimiter, auth_1.authenticate, recommendationController_1.markRecommendationAsRead);
recommendationRouter.delete('/:id', rateLimit_1.apiLimiter, auth_1.authenticate, recommendationController_1.deleteRecommendation);
exports.default = recommendationRouter;
//# sourceMappingURL=recommendations.js.map