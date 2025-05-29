export declare class CacheService {
    private get client();
    get<T>(key: string): Promise<T | null>;
    set(key: string, data: any, ttl?: number): Promise<void>;
    del(key: string): Promise<void>;
    delPattern(pattern: string): Promise<void>;
    cachePropertyList(filters: any, data: any): Promise<void>;
    getCachedPropertyList(filters: any): Promise<any>;
    cachePropertyDetail(propertyId: string, data: any): Promise<void>;
    getCachedPropertyDetail(propertyId: string): Promise<any>;
    cacheUserFavorites(cacheKey: string, data: any): Promise<void>;
    getCachedUserFavorites(cacheKey: string): Promise<any>;
    invalidatePropertyCaches(propertyId?: string): Promise<void>;
    invalidateUserFavorites(userId: string): Promise<void>;
}
export declare const cacheService: CacheService;
//# sourceMappingURL=cacheService.d.ts.map