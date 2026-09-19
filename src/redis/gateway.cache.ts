import { winstonLogger } from '@vsatya-kirankumar/jobber-shared';
import { createClient } from 'redis';
import { config } from '@gateway/config';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'gatewayCache', 'debug');
type RedisClient = ReturnType<typeof createClient>;

export class GatewayCache {
  client: RedisClient;

  constructor() {
    this.client = createClient({ url: `${config.REDIS_HOST}` });
  }

  async saveUserSelectedCategory(key: string, value: string): Promise<void> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }

      await this.client.SET(key, value);
    } catch (error) {
      log.log('error', 'saveUserSelectedCategory() method error in creating cache.', error);
    } finally {
      await this.client.quit();
    }
  }

  async saveLoggedInUserToCache(key: string, value: string): Promise<string[]> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }

      const index: number | null = await this.client.LPOS(key, value);
      if (index == null) {
        await this.client.LPUSH(key, value);
        log.info(`User ${value} added.`);
      }

      const response: string[] = await this.client.LRANGE(key, 0, -1); //Get all data
      return response;
    } catch (error) {
      log.log('error', 'saveUserSelectedCategory() method error in creating cache.', error);
      return [];
    }
  }

  async getLoggedInUserFromCache(key: string): Promise<string[]> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }

      const response: string[] = await this.client.LRANGE(key, 0, -1);
      return response;
    } catch (error) {
      log.log('error', 'getLoggedInUserFromCache() method error in creating cache.', error);
      return [];
    }
  }

  async removeLoggedInUserFromCache(key: string, value: string): Promise<string[]> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }

      await this.client.LREM(key, 1, value);
      log.info(`User ${value} removed from the cache.`);
      const response: string[] = await this.client.LRANGE(key, 0, -1);
      return response;
    } catch (error) {
      log.log('error', 'getLoggedInUserFromCache() method error in creating cache.', error);
      return [];
    }
  }
}
