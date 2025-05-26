import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { RoomUserModule } from '@/room-user/room-user.module';

@Module({
  imports: [PrismaModule, RoomUserModule],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
