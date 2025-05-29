"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const database_1 = require("./config/database");
const redis_1 = require("./config/redis");
const environment_1 = require("./config/environment");
const mainRouter_1 = __importDefault(require("./mainRouter"));
const app = (0, express_1.default)();
const startServer = async () => {
    await (0, database_1.connectDatabase)();
    await redis_1.redisConnection.connect();
    // Middleware (these are fine to register here)
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    // Register routes ONLY after Redis is connected
    app.use('/api', mainRouter_1.default);
    // Health-check
    app.get('/api/health', (req, res) => {
        res.json({ success: true, message: 'Server is healthy' });
    });
    app.listen(environment_1.config.port, () => {
        console.log(`Server running on port ${environment_1.config.port}`);
    });
};
startServer();
//# sourceMappingURL=server.js.map