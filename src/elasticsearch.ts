import { winstonLogger } from '@vsatya-kirankumar/jobber-shared';
import { config } from '@gateway/config';
import { Logger } from 'winston';
import Client from '@elastic/elasticsearch/lib/client';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationGatewayElasticSearchServer', 'debug');

class ElasticSearch {
  private elasticSearchClient: Client;

  constructor() {
    this.elasticSearchClient = new Client({ node: `${config.ELASTIC_SEARCH_URL}` || 'http://localhost:9200' });
  }

  public async checkElasticSearchConnection(): Promise<void> {
    let isConnected: boolean = false;
    while (!isConnected) {
      try {
        log.info('Gateway Service connecting to Elastic Search...');
        const health: ClusterHealthResponse = await this.elasticSearchClient.cluster.health({});
        log.info(`Gateway Service ElasticSearch health status - ${health.status}`);
        isConnected = true;
      } catch (error) {
        log.error('ElasticSearch connection failed. Retrying in 5 seconds...', error);
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }
}

export const elasticSearch: ElasticSearch = new ElasticSearch();
