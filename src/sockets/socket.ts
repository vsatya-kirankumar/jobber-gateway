import { Server, Socket } from 'socket.io';
import { io, Socket as SocketClient } from 'socket.io-client';
import { GatewayCache } from '@gateway/redis/gateway.cache';
import { config } from '@gateway/config';
import { IMessageDocument, IOrderDocument, IOrderNotifcation, winstonLogger } from '@vsatya-kirankumar/jobber-shared';
import { Logger } from 'winston';

let chatSocketClient: SocketClient;
let orderSocketClient: SocketClient;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'gatewaySocket', 'debug');

export class SocketIOAppHandler {
  private io: Server;
  private gatewayCache: GatewayCache;

  constructor(io: Server) {
    this.io = io;
    this.gatewayCache = new GatewayCache();
    this.chatSocketServiceIOConnection();
    this.orderSocketServiceIOConnection();
  }

  public listen(): void {
    this.io.on('connection', async (socket: Socket) => {
      socket.on('getLoggedInUser', async () => {
        const users: string[] = await this.gatewayCache.getLoggedInUserFromCache('loggedInUser');
        this.io.emit('online', users);
      });

      socket.on('loggedInUsers', async (username: string) => {
        const users: string[] = await this.gatewayCache.saveLoggedInUserToCache(`loggedInUser:${username}`, username);
        this.io.emit('online', users);
      });

      socket.on('removeLoggedInUser', async (username: string) => {
        const users: string[] = await this.gatewayCache.removeLoggedInUserFromCache(`loggedInUser:${username}`, username);
        this.io.emit('online', users);
      });

      socket.on('category', async (category: string, username: string) => {
        await this.gatewayCache.saveUserSelectedCategory(`selectedCategories:${category}`, username);
      });
    });
  }

  private chatSocketServiceIOConnection(): void {
    chatSocketClient = io(`${config.MESSAGE_BASE_URL}`, {
      transports: ['websocket', 'polling'],
      secure: true
    });

    chatSocketClient.on('connect', () => {
      log.info('ChatService socket connected: ', chatSocketClient.connected);
    });

    chatSocketClient.on('disconnect', (reason: SocketClient.DisconnectReason) => {
      log.log('error', 'ChatSocket disconnect reason:', reason.toString());
      chatSocketClient.connect();
    });

    chatSocketClient.on('connect_error', (error: Error) => {
      log.log('error', 'ChatService socket connection error:', error);
      chatSocketClient.connect();
    });

    // custom events
    chatSocketClient.on('message received', (data: IMessageDocument) => {
      this.io.emit('message received', data);
    });

    chatSocketClient.on('message updated', (data: IMessageDocument) => {
      this.io.emit('message updated', data);
    });
  }

  private orderSocketServiceIOConnection(): void {
    orderSocketClient = io(`${config.ORDER_BASE_URL}`, {
      transports: ['websocket', 'polling'],
      secure: true
    });

    orderSocketClient.on('connect', () => {
      log.info('OrderService socket connected: ', orderSocketClient.connected);
    });

    orderSocketClient.on('disconnect', (reason: SocketClient.DisconnectReason) => {
      log.log('error', 'OrderSocket disconnect reason:', reason.toString());
      orderSocketClient.connect();
    });

    orderSocketClient.on('connect_error', (error: Error) => {
      log.log('error', 'OrderService socket connection error:', error);
      orderSocketClient.connect();
    });

    orderSocketClient.on('order notification', (order: IOrderDocument, notification: IOrderNotifcation) => {
      this.io.emit('order received', order, notification);
    });
  }
}
