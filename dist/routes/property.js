"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const propertyController_1 = require("../controllers/propertyController");
const auth_1 = require("../middlewares/auth");
const cache_1 = require("../middlewares/cache");
const rateLimit_1 = require("../middlewares/rateLimit");
const multer_1 = require("../config/multer");
const propertyRouter = (0, express_1.Router)();
propertyRouter.post('/import-excel', auth_1.authenticate, multer_1.uploadSingle, propertyController_1.importPropertiesFromExcel);
propertyRouter.post('/', auth_1.authenticate, rateLimit_1.apiLimiter, multer_1.uploadMultiple, (0, cache_1.clearCache)('cache:*properties*'), propertyController_1.createProperty);
propertyRouter.get('/', rateLimit_1.apiLimiter, propertyController_1.getAllProperties);
propertyRouter.get('/my', rateLimit_1.apiLimiter, auth_1.authenticate, propertyController_1.getMyProperties);
propertyRouter.get('/:id', rateLimit_1.apiLimiter, propertyController_1.getPropertyById);
propertyRouter.put('/:id', rateLimit_1.apiLimiter, auth_1.authenticate, multer_1.uploadMultiple, (0, cache_1.clearCache)('cache:*properties*'), propertyController_1.updateProperty);
propertyRouter.delete('/:id', rateLimit_1.apiLimiter, auth_1.authenticate, (0, cache_1.clearCache)('cache:*properties*'), propertyController_1.deleteProperty);
exports.default = propertyRouter;
//# sourceMappingURL=property.js.map