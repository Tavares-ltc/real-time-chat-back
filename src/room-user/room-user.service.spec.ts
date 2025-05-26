import { Test, TestingModule } from '@nestjs/testing';
import { RoomUserService } from './room-user.service';
import { PrismaService } from '@/prisma/prisma.service';

describe('RoomUserService', () => {
  let service: RoomUserService;
  let prisma: PrismaService;

  const mockPrisma = {
    roomUser: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomUserService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<RoomUserService>(RoomUserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add a user to a room', async () => {
    const dto = { roomId: 'room1', userId: 'user1' };
    const result = { id: '1', ...dto, joinedAt: new Date() };
    mockPrisma.roomUser.create.mockResolvedValue(result);

    await expect(service.addUserToRoom(dto)).resolves.toEqual(result);
    expect(prisma.roomUser.create).toHaveBeenCalledWith({ data: dto });
  });

  it('should return all room users with user and room info', async () => {
    const result = [{ id: '1', roomId: 'room1', userId: 'user1', joinedAt: new Date() }];
    mockPrisma.roomUser.findMany.mockResolvedValue(result);

    await expect(service.findAll()).resolves.toEqual(result);
    expect(prisma.roomUser.findMany).toHaveBeenCalledWith({
      include: { user: true, room: true },
    });
  });

  it('should return users in a specific room', async () => {
    const roomId = 'room1';
    const result = [
      { id: '1', roomId, userId: 'user1', joinedAt: new Date(), user: { id: 'user1' } },
    ];
    mockPrisma.roomUser.findMany.mockResolvedValue(result);

    await expect(service.findUsersInRoom(roomId)).resolves.toEqual(result);
    expect(prisma.roomUser.findMany).toHaveBeenCalledWith({
      where: { roomId },
      include: { user: true },
    });
  });

  it('should remove a user from a room', async () => {
    const roomId = 'room1';
    const userId = 'user1';
    const result = { id: '1', roomId, userId, joinedAt: new Date() };
    mockPrisma.roomUser.delete.mockResolvedValue(result);

    await expect(service.removeUserFromRoom(roomId, userId)).resolves.toEqual(result);
    expect(prisma.roomUser.delete).toHaveBeenCalledWith({
      where: { userId_roomId: { roomId, userId } },
    });
  });

  it('should return true if user is in room', async () => {
    const roomId = 'room1';
    const userId = 'user1';
    mockPrisma.roomUser.findUnique.mockResolvedValue({ id: '1', roomId, userId, joinedAt: new Date() });

    await expect(service.isUserInRoom(roomId, userId)).resolves.toBe(true);
    expect(prisma.roomUser.findUnique).toHaveBeenCalledWith({
      where: { userId_roomId: { roomId, userId } },
    });
  });

  it('should return false if user is not in room', async () => {
    const roomId = 'room1';
    const userId = 'user1';
    mockPrisma.roomUser.findUnique.mockResolvedValue(null);

    await expect(service.isUserInRoom(roomId, userId)).resolves.toBe(false);
  });
});
