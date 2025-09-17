import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import type { WebsocketSyncEventPayload } from './websocket-sync-event-payload.type';

@WebSocketGateway({
  pingInterval: 30000,
  pingTimeout: 5000,
  cors: {
    origin: '*',
  },
})
export class WebsocketGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('sync')
  async streamMessagesData(
    @MessageBody() payload: WebsocketSyncEventPayload,
    @ConnectedSocket() client: Socket,
  ) {
    client.broadcast.emit('sync', payload);
    console.log(`Sync event from ${client.id}:`, payload);
    return { status: 'ok' };
  }
}
