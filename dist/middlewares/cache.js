"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCache = exports.cache = void 0;
const redis_1 = require("../config/redis");
const cache = (ttl = 300) => {
    return async (req, res, next) => {
        try {
            const client = redis_1.redisConnection.getClient();
            const key = `cache:${req.originalUrl || req.url}`;
            req.cacheKey = key;
            const cachedData = await client.get(key);
            if (cachedData) {
                console.debug(`Cache hit for key: ${key}`);
                res.json(JSON.parse(cachedData));
                return;
            }
            console.debug(`Cache miss for key: ${key}`);
            // Store original json method
            const originalJson = res.json;
            // Override json method to cache the response
            res.json = function (data) {
                // Cache the response
                client.setEx(key, ttl, JSON.stringify(data)).catch(error => {
                    console.error('Error caching data:', error);
                });
                // Call original json method
                return originalJson.call(this, data);
            };
            next();
        }
        catch (error) {
            console.error('Cache middleware error:', error);
            next();
        }
    };
};
exports.cache = cache;
const clearCache = (pattern) => {
    return async (req, res, next) => {
        try {
            const client = redis_1.redisConnection.getClient();
            const keys = await client.keys(pattern);
            if (keys.length > 0) {
                await client.del(keys);
                console.debug(`Cleared cache keys matching pattern: ${pattern}`);
            }
            next();
        }
        catch (error) {
            console.error('Clear cache error:', error);
            next();
        }
    };
};
exports.clearCache = clearCache;
//# sourceMappingURL=cache.js.map