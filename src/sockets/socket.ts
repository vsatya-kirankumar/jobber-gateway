import { Server, Socket } from 'socket.io';
import { GatewayCache } from '@gateway/redis/gateway.cache';

export class SocketIOHandler {
  private io: Server;
  private gatewayCache: GatewayCache;

  constructor(io: Server) {
    this.io = io;
    this.gatewayCache = new GatewayCache();
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
}
