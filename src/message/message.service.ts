import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateMessageDto } from '@/message/dto/create-message.dto';
import { MessageDto } from './dto/message.dto';
import { UserDto } from '@/user/dto/user.dto';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMessageDto: CreateMessageDto, userId: string): Promise<MessageDto> {
    const msg = await this.prisma.message.create({
      data: {
        content: createMessageDto.content,
        roomId: createMessageDto.roomId,
        userId,
      },
      include: {
        user: true,
      },
    });

    return new MessageDto({
      id: msg.id,
      content: msg.content,
      roomId: msg.roomId,
      userId: msg.userId,
      createdAt: msg.createdAt,
      user: new UserDto(msg.user),
    });
  }

  async findAllMessagesByRoom(roomId: string): Promise<MessageDto[]> {
    const messages = await this.prisma.message.findMany({
      where: { roomId },
      orderBy: { createdAt: 'asc' },
      include: {
        user: true,
      },
    });

    return messages.map(
      (msg) =>
        new MessageDto({
          id: msg.id,
          content: msg.content,
          roomId: msg.roomId,
          userId: msg.userId,
          createdAt: msg.createdAt,
          user: new UserDto(msg.user),
        }),
    );
  }
}
