"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisConnection = void 0;
const redis_1 = require("redis");
const environment_1 = require("./environment");
class RedisConnection {
    constructor() {
        this.client = null;
    }
    async connect() {
        try {
            this.client = (0, redis_1.createClient)({
                url: environment_1.config.redisUrl
            });
            this.client.on('error', (error) => {
                console.error('Redis connection error:', error);
            });
            this.client.on('connect', () => {
                console.info('Redis connected successfully');
            });
            this.client.on('ready', () => {
                console.info('Redis ready to accept commands');
            });
            this.client.on('end', () => {
                console.warn('Redis connection ended');
            });
            await this.client.connect();
            return this.client;
        }
        catch (error) {
            console.error('Failed to connect to Redis:', error);
            throw error;
        }
    }
    getClient() {
        if (!this.client) {
            throw new Error('Redis client not initialized. Call connect() first.');
        }
        return this.client;
    }
    async disconnect() {
        if (this.client) {
            await this.client.quit();
            this.client = null;
            console.info('Redis disconnected');
        }
    }
}
exports.redisConnection = new RedisConnection();
//# sourceMappingURL=redis.js.map