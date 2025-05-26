import { Test, TestingModule } from '@nestjs/testing';
import { RoomService } from './room.service';
import { PrismaService } from '@/prisma/prisma.service';

describe('RoomService', () => {
  let service: RoomService;
  let prismaMock: {
    room: {
      create: jest.Mock,
      findMany: jest.Mock,
      findFirst: jest.Mock,
      update: jest.Mock,
      delete: jest.Mock,
      findUnique: jest.Mock,
    }
  };

  beforeEach(async () => {
    prismaMock = {
      room: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<RoomService>(RoomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a room', async () => {
      const dto = { name: 'Room 1' };
      const ownerId = 'user-123';

      const createdRoom = {
        id: 'room-1',
        name: 'Room 1',
        ownerId,
        createdAt: new Date(),
      };

      prismaMock.room.create.mockResolvedValue(createdRoom);

      const result = await service.create(dto, ownerId);

      expect(prismaMock.room.create).toHaveBeenCalledWith({
        data: {
          ...dto,
          ownerId,
          users: {
            create: {
              userId: ownerId,
            },
          },
        },
        include: { users: true },
      });

      expect(result).toEqual(createdRoom);
    });
  });

  describe('isOwner', () => {
    it('should return true if user is owner', async () => {
      const roomId = 'room-1';
      const userId = 'user-123';

      prismaMock.room.findUnique.mockResolvedValue({ ownerId: userId });

      const result = await service.isOwner(roomId, userId);

      expect(prismaMock.room.findUnique).toHaveBeenCalledWith({
        where: { id: roomId },
        select: { ownerId: true },
      });

      expect(result).toBe(true);
    });

    it('should return false if room not found', async () => {
      prismaMock.room.findUnique.mockResolvedValue(null);

      const result = await service.isOwner('room-2', 'user-123');

      expect(result).toBe(false);
    });
  });
});
