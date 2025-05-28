import { Module } from '@nestjs/common';
import { RoomUserService } from './room-user.service';
import { RoomUserController } from './room-user.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { RoomModule } from '@/room/room.module';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [PrismaModule, RoomModule, UserModule],
  controllers: [RoomUserController],
  providers: [RoomUserService],
  exports: [RoomUserService],
})
export class RoomUserModule {}
