import { Test, TestingModule } from '@nestjs/testing';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { RoomUserService } from '@/room-user/room-user.service';
import { UnauthorizedException } from '@nestjs/common';

describe('MessageController', () => {
  let controller: MessageController;
  let messageService: MessageService;
  let roomUserService: RoomUserService;

  const mockMessageService = {
    findAllMessagesByRoom: jest.fn(),
  };

  const mockRoomUserService = {
    isUserInRoom: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [
        { provide: MessageService, useValue: mockMessageService },
        { provide: RoomUserService, useValue: mockRoomUserService },
      ],
    }).compile();

    controller = module.get<MessageController>(MessageController);
    messageService = module.get<MessageService>(MessageService);
    roomUserService = module.get<RoomUserService>(RoomUserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    const mockUser = { userId: 'user-123', email: 'user@email.com' };
    const roomId = 'room-abc';

    it('should return messages if user is in room', async () => {
      const mockMessages = [{ text: 'Hello' }];
      mockRoomUserService.isUserInRoom.mockResolvedValue(true);
      mockMessageService.findAllMessagesByRoom.mockResolvedValue(mockMessages);

      const result = await controller.findAll(roomId, mockUser);

      expect(roomUserService.isUserInRoom).toHaveBeenCalledWith(roomId, mockUser.userId);
      expect(messageService.findAllMessagesByRoom).toHaveBeenCalledWith(roomId);
      expect(result).toEqual(mockMessages);
    });

    it('should throw UnauthorizedException if user is not in room', async () => {
      mockRoomUserService.isUserInRoom.mockResolvedValue(false);

      await expect(controller.findAll(roomId, mockUser)).rejects.toThrow(UnauthorizedException);
    });
  });
});
