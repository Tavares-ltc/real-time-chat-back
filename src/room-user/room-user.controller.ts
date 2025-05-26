import { Controller, Post, Body, Delete, Get, Param, UseGuards, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { RoomUserService } from './room-user.service';
import { CreateRoomUserDto } from '@/room-user/dto/create-room-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RoomService } from '@/room/room.service';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/auth/interfaces/jwt-payload.interface';

@ApiTags('Room Users')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('room-users')
export class RoomUserController {
  constructor(
    private readonly roomUserService: RoomUserService,
    private readonly roomService: RoomService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Add a user to a room' })
  @ApiResponse({ status: 201, description: 'User successfully added to the room' })
  @ApiResponse({ status: 400, description: 'Invalid data or user already in room' })
  async addUserToRoom(@Body() dto: CreateRoomUserDto) {
    const isAlreadyIn = await this.roomService.findOne(dto.roomId, dto.userId)
    if (isAlreadyIn) {
      throw new ConflictException('User already in room')
    }
    return this.roomUserService.addUserToRoom(dto);
  }

  @Get(':roomId')
  @ApiOperation({ summary: 'List users in a room' })
  @ApiParam({ name: 'roomId', description: 'ID of the room' })
  @ApiResponse({ status: 200, description: 'List of users in the room returned successfully' })
  async findUsersInRoom(
    @Param('roomId') roomId: string,
    @CurrentUser() user: JwtPayload
) {
    const isUserInRoom = await this.roomUserService.isUserInRoom(roomId, user.userId)
    if(!isUserInRoom){
       throw new UnauthorizedException()
    }
    return this.roomUserService.findUsersInRoom(roomId);
  }

@Delete(':roomId/:userId')
@ApiOperation({ summary: 'Remove a user from a room' })
@ApiParam({ name: 'roomId', description: 'ID of the room' })
@ApiParam({ name: 'userId', description: 'ID of the user to remove' })
@ApiResponse({ status: 200, description: 'User successfully removed from the room' })
@ApiResponse({ status: 404, description: 'User not found in the room' })
@ApiResponse({ status: 401, description: 'Unauthorized: Must be the user or room owner' })
async removeUserFromRoom(
  @Param('roomId') roomId: string,
  @Param('userId') userId: string,
  @CurrentUser() user: JwtPayload
) {
  const isSelf = user.userId === userId;

  const isOwner = await this.roomService.isOwner(roomId, user.userId);
  if (!isSelf && !isOwner) {
    throw new UnauthorizedException('Must be the user or the room owner');
  }

  return this.roomUserService.removeUserFromRoom(roomId, userId);
}
}
