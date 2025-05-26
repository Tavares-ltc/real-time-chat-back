import { Module } from '@nestjs/common';
import { RoomUserService } from './room-user.service';
import { RoomUserController } from './room-user.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { RoomModule } from '@/room/room.module';

@Module({
  imports: [PrismaModule, RoomModule],
  controllers: [RoomUserController],
  providers: [RoomUserService],
  exports: [RoomUserService],
})
export class RoomUserModule {}
