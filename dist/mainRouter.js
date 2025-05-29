"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./routes/auth"));
const property_1 = __importDefault(require("./routes/property"));
const favourites_1 = __importDefault(require("./routes/favourites"));
const recommendations_1 = __importDefault(require("./routes/recommendations"));
const mainRouter = (0, express_1.Router)();
mainRouter.use('/auth', auth_1.default);
mainRouter.use('/properties', property_1.default);
mainRouter.use('/favourites', favourites_1.default);
mainRouter.use('/recommendations', recommendations_1.default);
exports.default = mainRouter;
//# sourceMappingURL=mainRouter.js.map