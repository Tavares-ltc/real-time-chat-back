import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateMessageDto } from '@/message/dto/create-message.dto';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  create(createMessageDto: CreateMessageDto, userId: string) {
    return this.prisma.message.create({
      data: {
        content: createMessageDto.content,
        roomId: createMessageDto.roomId,
        userId,
      },
      include: {
        user: true,
      },
    });
  }

  findAllByRoom(roomId: string) {
    return this.prisma.message.findMany({
      where: { roomId },
      orderBy: { createdAt: 'asc' },
      include: {
        user: true,
      },
    });
  }
}
