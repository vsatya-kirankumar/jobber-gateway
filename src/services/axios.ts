import axios from 'axios';
import { sign } from 'jsonwebtoken';
import { config } from '@gateway/config';

export class AxiosService {
  public axios: ReturnType<typeof axios.create>;

  constructor(baseUrl: string, serviceName: string) {
    this.axios = this.cretateAxiosInstance(baseUrl, serviceName);
  }

  public cretateAxiosInstance(baseUrl: string, serviceName?: string): ReturnType<typeof axios.create> {
    let gatewayToken: string = '';
    if (serviceName) {
      gatewayToken = sign({ id: serviceName }, `${config.GATEWAY_JWT_TOKEN}`);
    }
    const instance: ReturnType<typeof axios.create> = axios.create({
      baseURL: baseUrl,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        gatewayToken: gatewayToken
      },
      withCredentials: true
    });

    return instance;
  }
}
