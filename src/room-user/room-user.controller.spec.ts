import { Test, TestingModule } from '@nestjs/testing';
import { RoomUserController } from './room-user.controller';
import { RoomUserService } from './room-user.service';
import { RoomService } from '@/room/room.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('RoomUserController', () => {
  let controller: RoomUserController;
  let roomUserService: {
    addUserToRoom: jest.Mock;
    isUserInRoom: jest.Mock;
    findUsersInRoom: jest.Mock;
    removeUserFromRoom: jest.Mock;
  };
  let roomService: {
    findOne: jest.Mock;
    isOwner: jest.Mock;
  };

  beforeEach(async () => {
    roomUserService = {
      addUserToRoom: jest.fn(),
      isUserInRoom: jest.fn(),
      findUsersInRoom: jest.fn(),
      removeUserFromRoom: jest.fn(),
    };
    roomService = {
      findOne: jest.fn(),
      isOwner: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomUserController],
      providers: [
        { provide: RoomUserService, useValue: roomUserService },
        { provide: RoomService, useValue: roomService },
      ],
    }).compile();

    controller = module.get<RoomUserController>(RoomUserController);
  });

  describe('addUserToRoom', () => {
    it('should add user if not already in room', async () => {
      const dto = { roomId: 'r1', userId: 'u1' };
      roomService.findOne.mockResolvedValue(null);
      roomUserService.addUserToRoom.mockResolvedValue('user-added');

      const result = await controller.addUserToRoom(dto);

      expect(roomService.findOne).toHaveBeenCalledWith(dto.roomId, dto.userId);
      expect(roomUserService.addUserToRoom).toHaveBeenCalledWith(dto);
      expect(result).toBe('user-added');
    });

    it('should throw ConflictException if user already in room', async () => {
      const dto = { roomId: 'r1', userId: 'u1' };
      roomService.findOne.mockResolvedValue({});

      await expect(controller.addUserToRoom(dto)).rejects.toThrow(ConflictException);
      expect(roomUserService.addUserToRoom).not.toHaveBeenCalled();
    });
  });

  describe('findUsersInRoom', () => {
    it('should return list of users if user is in room', async () => {
      const roomId = 'r1';
      const user = { userId: 'u1', email: 'email@email.com' };
      roomUserService.isUserInRoom.mockResolvedValue(true);
      roomUserService.findUsersInRoom.mockResolvedValue(['user1', 'user2']);

      const result = await controller.findUsersInRoom(roomId, user);

      expect(roomUserService.isUserInRoom).toHaveBeenCalledWith(roomId, user.userId);
      expect(roomUserService.findUsersInRoom).toHaveBeenCalledWith(roomId);
      expect(result).toEqual(['user1', 'user2']);
    });

    it('should throw UnauthorizedException if user is not in room', async () => {
      const roomId = 'r1';
      const user = { userId: 'u1', email: 'email@email.com' };
      roomUserService.isUserInRoom.mockResolvedValue(false);

      await expect(controller.findUsersInRoom(roomId, user)).rejects.toThrow(UnauthorizedException);
      expect(roomUserService.findUsersInRoom).not.toHaveBeenCalled();
    });
  });

  describe('removeUserFromRoom', () => {
    it('should allow user to remove themselves', async () => {
      const roomId = 'r1';
      const userId = 'u1';
      const user = { userId: 'u1', email: 'email@email.com' };
      roomService.isOwner.mockResolvedValue(false);
      roomUserService.removeUserFromRoom.mockResolvedValue('removed');

      const result = await controller.removeUserFromRoom(roomId, userId, user);

      expect(roomUserService.removeUserFromRoom).toHaveBeenCalledWith(roomId, userId);
      expect(result).toBe('removed');
    });

    it('should allow owner to remove other user', async () => {
      const roomId = 'r1';
      const userId = 'u2';
      const user = { userId: 'u1', email: 'email@email.com' };
      roomService.isOwner.mockResolvedValue(true);
      roomUserService.removeUserFromRoom.mockResolvedValue('removed');

      const result = await controller.removeUserFromRoom(roomId, userId, user);

      expect(roomService.isOwner).toHaveBeenCalledWith(roomId, user.userId);
      expect(roomUserService.removeUserFromRoom).toHaveBeenCalledWith(roomId, userId);
      expect(result).toBe('removed');
    });

    it('should throw UnauthorizedException if not self or owner', async () => {
      const roomId = 'r1';
      const userId = 'u2';
      const user = { userId: 'u1', email: 'email@email.com' };
      roomService.isOwner.mockResolvedValue(false);

      await expect(controller.removeUserFromRoom(roomId, userId, user)).rejects.toThrow(UnauthorizedException);
      expect(roomUserService.removeUserFromRoom).not.toHaveBeenCalled();
    });
  });
});
