import { RedisClientType } from 'redis';
declare class RedisConnection {
    private client;
    connect(): Promise<RedisClientType>;
    getClient(): RedisClientType;
    disconnect(): Promise<void>;
}
export declare const redisConnection: RedisConnection;
export {};
//# sourceMappingURL=redis.d.ts.map