import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, Room } from '@prisma/client'
import { CreateRoomDto } from './dto/create-room.dto'

@Injectable()
export class RoomService {
  constructor (private prisma: PrismaService) {}

  create (data: CreateRoomDto, ownerId: string): Promise<Room> {
    return this.prisma.room.create({
      data: {
        ...data,
        ownerId,
        users: {
          create: {
            userId: ownerId,
          },
        },
      },
      include: { users: true },
    })
  }

findAll(userId: string): Promise<Room[]> {
  return this.prisma.room.findMany({
    where: {
      users: {
        some: {
          userId: userId,
        },
      },
    }
  });
}

findOne(id: string, userId: string): Promise<Room | null> {
  return this.prisma.room.findFirst({
    where: {
      id,
      users: {
        some: {
          userId,
        },
      },
    },
  });
}

  update (id: string, data: Prisma.RoomUpdateInput): Promise<Room> {
    return this.prisma.room.update({ where: { id }, data })
  }

  remove (id: string): Promise<Room> {
    return this.prisma.room.delete({ where: { id } })
  }

  async isOwner(roomId: string, userId: string): Promise<boolean> {
  const room = await this.prisma.room.findUnique({
    where: { id: roomId },
    select: { ownerId: true },
  });

  if (!room) {
    return false;
  }

  return room.ownerId === userId;
}
}
