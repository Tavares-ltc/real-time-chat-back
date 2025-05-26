import { Module } from '@nestjs/common'
import { PrismaModule } from './prisma/prisma.module'
import { UserModule } from './user/user.module'
import { RoomModule } from './room/room.module'
import { AuthModule } from './auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import { RoomUserModule } from './room-user/room-user.module';
import { MessageModule } from './message/message.module';

const GlobalConfigModule = ConfigModule.forRoot({
  isGlobal: true,
})

@Module({
  imports: [
    GlobalConfigModule,
    PrismaModule,
    UserModule,
    RoomModule,
    AuthModule,
    RoomUserModule,
    MessageModule,
  ],
})
export class AppModule {}
