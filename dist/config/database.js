"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDatabase = exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const environment_1 = require("./environment");
const connectDatabase = async () => {
    try {
        const connection = await mongoose_1.default.connect(environment_1.config.mongodbUri);
        console.info(`MongoDB connected: ${connection.connection.host}`);
        mongoose_1.default.connection.on('error', (error) => {
            console.error('MongoDB connection error:', error);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected');
        });
    }
    catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }
};
exports.connectDatabase = connectDatabase;
const disconnectDatabase = async () => {
    try {
        await mongoose_1.default.disconnect();
        console.info('MongoDB disconnected');
    }
    catch (error) {
        console.error('Error disconnecting from MongoDB:', error);
    }
};
exports.disconnectDatabase = disconnectDatabase;
//# sourceMappingURL=database.js.map