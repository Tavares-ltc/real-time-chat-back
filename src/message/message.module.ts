import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MessageGateway } from '@/message/gateways/message.gateway';
import { PrismaModule } from '@/prisma/prisma.module';
import { RoomUserModule } from '@/room-user/room-user.module';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [PrismaModule, RoomUserModule, UserModule],
  controllers: [MessageController],
  providers: [MessageService, MessageGateway],
})
export class MessageModule {}
