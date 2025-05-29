import dotenv from 'dotenv';

dotenv.config();

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

export const config: IConfig = {
  port: process.env.PORT!,
  nodeEnv: process.env.NODE_ENV!,
  mongodbUri: process.env.MONGODB_URI!,
  redisUrl: process.env.REDIS_URL!,
  jwtSecret: process.env.JWT_SECRET!,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN!,
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    apiSecret: process.env.CLOUDINARY_API_SECRET!,
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS!),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS!),
  },
};
