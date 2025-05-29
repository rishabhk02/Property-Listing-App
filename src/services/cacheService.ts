import { redisConnection } from '../config/redis';
import { CACHE_KEYS, CACHE_TTL } from '../utils/constants';

export class CacheService {
  private get client() {
    return redisConnection.getClient();
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, data: any, ttl: number = CACHE_TTL.MEDIUM): Promise<void> {
    try {
      await this.client.setEx(key, ttl, JSON.stringify(data));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
        console.debug(`Deleted ${keys.length} cache keys matching pattern: ${pattern}`);
      }
    } catch (error) {
      console.error('Cache delete pattern error:', error);
    }
  }

  async cachePropertyList(filters: any, data: any): Promise<void> {
    const key = `${CACHE_KEYS.PROPERTIES_LIST}:${JSON.stringify(filters)}`;
    await this.set(key, data, CACHE_TTL.SHORT);
  }

  async getCachedPropertyList(filters: any): Promise<any> {
    const key = `${CACHE_KEYS.PROPERTIES_LIST}:${JSON.stringify(filters)}`;
    return this.get(key);
  }

  async cachePropertyDetail(propertyId: string, data: any): Promise<void> {
    const key = `${CACHE_KEYS.PROPERTY_DETAIL}:${propertyId}`;
    await this.set(key, data, CACHE_TTL.MEDIUM);
  }

  async getCachedPropertyDetail(propertyId: string): Promise<any> {
    const key = `${CACHE_KEYS.PROPERTY_DETAIL}:${propertyId}`;
    return this.get(key);
  }

  async cacheUserFavorites(cacheKey: string, data: any): Promise<void> {
    await this.set(cacheKey, data, CACHE_TTL.MEDIUM);
  }

  async getCachedUserFavorites(cacheKey: string): Promise<any> {
    return this.get(cacheKey);
  }

  async invalidatePropertyCaches(propertyId?: string): Promise<void> {
    await this.delPattern(`${CACHE_KEYS.PROPERTIES_LIST}:*`);
    await this.delPattern(`${CACHE_KEYS.PROPERTY_COUNT}:*`);
    if (propertyId) {
      await this.del(`${CACHE_KEYS.PROPERTY_DETAIL}:${propertyId}`);
    }
  }

  async invalidateUserFavorites(userId: string): Promise<void> {
    var data = await this.delPattern(`${CACHE_KEYS.USER_FAVORITES}:${userId}:*`);
    console.log(data);
  }
}

export const cacheService = new CacheService();
