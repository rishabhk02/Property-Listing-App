"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheService = exports.CacheService = void 0;
const redis_1 = require("../config/redis");
const constants_1 = require("../utils/constants");
class CacheService {
    get client() {
        return redis_1.redisConnection.getClient();
    }
    async get(key) {
        try {
            const data = await this.client.get(key);
            return data ? JSON.parse(data) : null;
        }
        catch (error) {
            console.error('Cache get error:', error);
            return null;
        }
    }
    async set(key, data, ttl = constants_1.CACHE_TTL.MEDIUM) {
        try {
            await this.client.setEx(key, ttl, JSON.stringify(data));
        }
        catch (error) {
            console.error('Cache set error:', error);
        }
    }
    async del(key) {
        try {
            await this.client.del(key);
        }
        catch (error) {
            console.error('Cache delete error:', error);
        }
    }
    async delPattern(pattern) {
        try {
            const keys = await this.client.keys(pattern);
            if (keys.length > 0) {
                await this.client.del(keys);
                console.debug(`Deleted ${keys.length} cache keys matching pattern: ${pattern}`);
            }
        }
        catch (error) {
            console.error('Cache delete pattern error:', error);
        }
    }
    async cachePropertyList(filters, data) {
        const key = `${constants_1.CACHE_KEYS.PROPERTIES_LIST}:${JSON.stringify(filters)}`;
        await this.set(key, data, constants_1.CACHE_TTL.SHORT);
    }
    async getCachedPropertyList(filters) {
        const key = `${constants_1.CACHE_KEYS.PROPERTIES_LIST}:${JSON.stringify(filters)}`;
        return this.get(key);
    }
    async cachePropertyDetail(propertyId, data) {
        const key = `${constants_1.CACHE_KEYS.PROPERTY_DETAIL}:${propertyId}`;
        await this.set(key, data, constants_1.CACHE_TTL.MEDIUM);
    }
    async getCachedPropertyDetail(propertyId) {
        const key = `${constants_1.CACHE_KEYS.PROPERTY_DETAIL}:${propertyId}`;
        return this.get(key);
    }
    async cacheUserFavorites(cacheKey, data) {
        await this.set(cacheKey, data, constants_1.CACHE_TTL.MEDIUM);
    }
    async getCachedUserFavorites(cacheKey) {
        return this.get(cacheKey);
    }
    async invalidatePropertyCaches(propertyId) {
        await this.delPattern(`${constants_1.CACHE_KEYS.PROPERTIES_LIST}:*`);
        await this.delPattern(`${constants_1.CACHE_KEYS.PROPERTY_COUNT}:*`);
        if (propertyId) {
            await this.del(`${constants_1.CACHE_KEYS.PROPERTY_DETAIL}:${propertyId}`);
        }
    }
    async invalidateUserFavorites(userId) {
        var data = await this.delPattern(`${constants_1.CACHE_KEYS.USER_FAVORITES}:${userId}:*`);
        console.log(data);
    }
}
exports.CacheService = CacheService;
exports.cacheService = new CacheService();
//# sourceMappingURL=cacheService.js.map