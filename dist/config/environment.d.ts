interface IConfig {
    port: string;
    nodeEnv: string;
    mongodbUri: string;
    redisUrl: string;
    jwtSecret: string;
    jwtExpiresIn: string | number;
    cloudinary: {
        cloudName: string;
        apiKey: string;
        apiSecret: string;
    };
    rateLimit: {
        windowMs: number;
        maxRequests: number;
    };
}
export declare const config: IConfig;
export {};
//# sourceMappingURL=environment.d.ts.map