"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const favouriteController_1 = require("../controllers/favouriteController");
const auth_1 = require("../middlewares/auth");
const rateLimit_1 = require("../middlewares/rateLimit");
const favouriteRouter = (0, express_1.Router)();
favouriteRouter.get('/', rateLimit_1.apiLimiter, auth_1.authenticate, favouriteController_1.getUserFavorites);
favouriteRouter.post('/:propertyId', rateLimit_1.apiLimiter, auth_1.authenticate, favouriteController_1.addToFavorites);
favouriteRouter.delete('/:propertyId', rateLimit_1.apiLimiter, auth_1.authenticate, favouriteController_1.removeFromFavorites);
favouriteRouter.get('/:propertyId/status', rateLimit_1.apiLimiter, auth_1.authenticate, favouriteController_1.checkFavoriteStatus);
exports.default = favouriteRouter;
//# sourceMappingURL=favourites.js.map