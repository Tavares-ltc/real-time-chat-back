import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateRoomUserDto } from '@/room-user/dto/create-room-user.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RoomUserService {
  constructor(private prisma: PrismaService) {}

  async addUserToRoom(data: CreateRoomUserDto) {
    return this.prisma.roomUser.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.roomUser.findMany({
      include: {
        user: true,
        room: true,
      },
    });
  }

  async findUsersInRoom(roomId: string) {
    return this.prisma.roomUser.findMany({
      where: { roomId },
      include: { user: true },
    });
  }

  async removeUserFromRoom(roomId: string, userId: string) {
    return this.prisma.roomUser.delete({
      where: {
        userId_roomId: { userId, roomId },
      },
    });
  }

  async isUserInRoom(roomId: string, userId: string): Promise<boolean> {
  const roomUser = await this.prisma.roomUser.findUnique({
    where: {
      userId_roomId: {
        roomId,
        userId
      }
    }
  });

  return !!roomUser;
}

}
