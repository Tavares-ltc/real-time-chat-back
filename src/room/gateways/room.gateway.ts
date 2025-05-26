import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from '@/room/room.service';

@WebSocketGateway({
  namespace: '/rooms',
  cors: { origin: '*' },
})
export class RoomGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly roomService: RoomService) {}

  afterInit(server: Server) {
    console.log('RoomGateway initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

@SubscribeMessage('joinRoom')
async handleJoinRoom(
  @MessageBody() data: { roomId: string },
  @ConnectedSocket() client: Socket,
) {
  const roomExists = await this.roomService.exists(data.roomId);
  if (!roomExists) {
    client.emit('error', 'Sala não encontrada');
    return;
  }
  client.join(data.roomId);
  this.server.to(data.roomId).emit('userJoined', client.id);
}

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(@MessageBody() data: { roomId: string }, @ConnectedSocket() client: Socket) {
    client.leave(data.roomId);
    this.server.to(data.roomId).emit('userLeft', client.id);
  }
}
