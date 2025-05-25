import { Module } from '@nestjs/common'
import { PrismaModule } from './prisma/prisma.module'
import { UserModule } from './user/user.module'
import { RoomModule } from './room/room.module'
import { AuthModule } from './auth/auth.module'
import { ConfigModule } from '@nestjs/config'

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
  ],
})
export class AppModule {}
