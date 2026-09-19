import { winstonLogger } from '@vsatya-kirankumar/jobber-shared';
import { createClient } from 'redis';
import { config } from '@gateway/config';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'Gateway Redis Connection', 'debug');
type RedisClient = ReturnType<typeof createClient>;

class RedisConnection {
  client: RedisClient;

  constructor() {
    this.client = createClient({ url: `${config.REDIS_HOST}` });
  }

  redisConnect = async (): Promise<void> => {
    try {
      await this.client.connect();
      log.info(`GatewayService Redis Connection: ${await this.client.ping()}`);
      this.cacheError();
    } catch (error) {
      log.log('error', 'GatewayService redisConnect() method error:', error);
    }
  };

  private cacheError = (): void => {
    this.client.on('error', (error: unknown) => {
      log.error(error);
    });
  };
}

export const redisConnection: RedisConnection = new RedisConnection();
