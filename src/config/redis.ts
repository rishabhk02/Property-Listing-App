import { createClient, RedisClientType } from 'redis';
import { config } from './environment';

class RedisConnection {
  private client: RedisClientType | null = null;
  
  async connect(): Promise<RedisClientType> {
    try {
      this.client = createClient({
        url: config.redisUrl
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
      
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      throw error;
    }
  }
  
  getClient(): RedisClientType {
    if (!this.client) {
      throw new Error('Redis client not initialized. Call connect() first.');
    }
    return this.client;
  }
  
  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
      console.info('Redis disconnected');
    }
  }
}

export const redisConnection = new RedisConnection();