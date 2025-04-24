import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: true })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('ChatGateway');

  afterInit(server: Server) {
    this.logger.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: { sender: string; message: string; room: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.to(data.room).emit('message', data);
    this.logger.log(
      `Message from ${data.sender} in room ${data.room}: ${data.message}`,
    );
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: Socket,
  ) {
    await client.join(data.room);
    this.logger.log(`Client ${client.id} joined room: ${data.room}`);
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @MessageBody() data: { room: string; sender: string },
    @ConnectedSocket() client: Socket,
  ) {
    const message = {
      ...data,
      message: `User with this id ${data.sender} has left the room`,
    };

    client.to(data.room).emit('message', message);
    await client.leave(data.room);
  }
}
