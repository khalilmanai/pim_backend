import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(NotificationGateway.name);
  private userConnections: Map<string, Set<string>> = new Map();
  private clients: Map<string, Socket> = new Map();

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      if (!this.userConnections.has(userId)) {
        this.userConnections.set(userId, new Set());
      }
      this.userConnections.get(userId).add(client.id);
      this.clients.set(client.id, client);
      this.logger.log(`Client connected: ${client.id} for user ${userId}`);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId && this.userConnections.has(userId)) {
      this.userConnections.get(userId).delete(client.id);
      if (this.userConnections.get(userId).size === 0) {
        this.userConnections.delete(userId);
      }
    }
    this.clients.delete(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async sendNotificationToUser(userId: string, message: any) {
    if (this.userConnections.has(userId)) {
      const connections = this.userConnections.get(userId);
      connections.forEach(connectionId => {
        const client = this.clients.get(connectionId);
        if (client) {
          client.send('notification', message);
          this.logger.log(`Notification sent to user ${userId}`);
      console.log(`Notification sent to user ${userId}`);
        }
      });
      this.logger.log(`Notification sent to user ${userId}`);
      console.log(`Notification sent to user ${userId}`);
      return true;
    }
    return false;
  }

  @SubscribeMessage('ping')
  handlePing(client: Socket, data: any) {
    client.emit('pong', { timestamp: Date.now() });
  }
}