import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

describe('MessageService', () => {
  let service: MessageService;
  let prisma: PrismaService;

  const mockPrisma = {
    message: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<MessageService>(MessageService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new message', async () => {
      const dto: CreateMessageDto = {
        content: 'Hello Everyone',
        roomId: 'room123',
      };
      const userId = 'user456';
      const createdMessage = {
        id: 'msg789',
        content: dto.content,
        roomId: dto.roomId,
        userId,
        user: { id: userId, name: 'tester' },
        createdAt: new Date(),
      };

      mockPrisma.message.create.mockResolvedValue(createdMessage);

      const result = await service.create(dto, userId);

      expect(prisma.message.create).toHaveBeenCalledWith({
        data: {
          content: dto.content,
          roomId: dto.roomId,
          userId,
        },
        include: {
          user: true,
        },
      });

      expect(result).toEqual(createdMessage);
    });
  });

  describe('findAllByRoom', () => {
    it('should return messages from a room ordered by createdAt', async () => {
      const roomId = 'room123';
      const messages = [
        { id: 'msg1', content: 'A', createdAt: new Date(), user: {} },
        { id: 'msg2', content: 'B', createdAt: new Date(), user: {} },
      ];

      mockPrisma.message.findMany.mockResolvedValue(messages);

      const result = await service.findAllMessagesByRoom(roomId);

      expect(prisma.message.findMany).toHaveBeenCalledWith({
        where: { roomId },
        orderBy: { createdAt: 'asc' },
        include: {
          user: true,
        },
      });

      expect(result).toEqual(messages);
    });
  });
});
