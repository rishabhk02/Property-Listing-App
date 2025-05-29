import { Request, Response, NextFunction } from 'express';
export interface CacheRequest extends Request {
    cacheKey?: string;
}
export declare const cache: (ttl?: number) => (req: CacheRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const clearCache: (pattern: string) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=cache.d.ts.map