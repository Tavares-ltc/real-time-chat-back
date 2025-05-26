import { Test, TestingModule } from '@nestjs/testing';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { JwtPayload } from '@/auth/interfaces/jwt-payload.interface';

describe('RoomController', () => {
  let controller: RoomController;
  let roomService: jest.Mocked<RoomService>;

  const mockUser: JwtPayload = {
    userId: 'user-123',
    email: 'user@example.com',
  };

  const mockRoom = {
    id: 'room-1',
    name: 'Room 1',
    ownerId: mockUser.userId,
    createdAt: new Date(),
  };

  const mockRoomService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    isOwner: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomController],
      providers: [
        {
          provide: RoomService,
          useValue: mockRoomService,
        },
      ],
    }).compile();

    controller = module.get<RoomController>(RoomController);
    roomService = module.get(RoomService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a room with the current user as owner', async () => {
      const dto: CreateRoomDto = { name: 'Room 1' };
      roomService.create.mockResolvedValue(mockRoom);

      const result = await controller.create(dto, mockUser);
      expect(roomService.create).toHaveBeenCalledWith(dto, mockUser.userId);
      expect(result).toEqual(mockRoom);
    });
  });

  describe('findAll', () => {
    it('should return all rooms of the user', async () => {
      const rooms = [mockRoom, { ...mockRoom, id: 'room-2' }];
      roomService.findAll.mockResolvedValue(rooms);

      const result = await controller.findAll(mockUser);
      expect(result).toEqual(rooms);
    });
  });

  describe('findOne', () => {
    it('should return the room if found', async () => {
      roomService.findOne.mockResolvedValue(mockRoom);

      const result = await controller.findOne('room-1', mockUser);
      expect(result).toEqual(mockRoom);
    });

    it('should throw if room not found', async () => {
      roomService.findOne.mockResolvedValue(null);

      await expect(controller.findOne('room-1', mockUser)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update the room if user is owner', async () => {
      const updateDto: UpdateRoomDto = { name: 'Updated Room' };
      const updatedRoom = { ...mockRoom, name: 'Updated Room' };

      roomService.isOwner.mockResolvedValue(true);
      roomService.update.mockResolvedValue(updatedRoom);

      const result = await controller.update('room-1', updateDto, mockUser);
      expect(roomService.update).toHaveBeenCalledWith('room-1', updateDto);
      expect(result).toEqual(updatedRoom);
    });

    it('should throw Forbidden if user is not owner', async () => {
      roomService.isOwner.mockResolvedValue(false);

      await expect(
        controller.update('room-1', { name: 'Updated' }, mockUser)
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should remove the room if user is owner', async () => {
    const resultMock = {
      id: 'room-1',
      name: 'Room 1',
      ownerId: mockUser.userId,
      createdAt: new Date(),
    };
      roomService.isOwner.mockResolvedValue(true);
      roomService.remove.mockResolvedValue(resultMock);

      const result = await controller.remove('room-1', mockUser, {} as any);
      expect(result).toEqual(resultMock);
    });

    it('should throw Forbidden if user is not owner', async () => {
      roomService.isOwner.mockResolvedValue(false);

      await expect(
        controller.remove('room-1', mockUser, {} as any)
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
