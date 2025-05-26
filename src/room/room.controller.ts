import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { RoomService } from '@/room/room.service';
import { CreateRoomDto } from '@/room/dto/create-room.dto';
import { UpdateRoomDto } from '@/room/dto/update-room.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request } from 'express';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/auth/interfaces/jwt-payload.interface';

@ApiTags('rooms')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new room' })
  @ApiResponse({ status: 201, description: 'Room successfully created' })
  async create(@Body() createRoomDto: CreateRoomDto, @CurrentUser() user: JwtPayload) {
    const userId = user.userId;
    return this.roomService.create(createRoomDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'List all rooms' })
  @ApiResponse({ status: 200, description: 'List of all rooms' })
  findAll(@CurrentUser() user: JwtPayload) {
    return this.roomService.findAll(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a room by ID' })
  @ApiResponse({ status: 200, description: 'Room found' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  async findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const room = await this.roomService.findOne(id, user.userId);
    if (!room) throw new BadRequestException('Room not found');
    return room;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a room' })
  @ApiResponse({ status: 200, description: 'Room successfully updated' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
    @CurrentUser() user: JwtPayload
  ) {
    const userId = user.userId;
    const isOwner = await this.roomService.isOwner(id, userId);
    if (!isOwner) throw new ForbiddenException('Only the owner can update the room');
    return this.roomService.update(id, updateRoomDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a room' })
  @ApiResponse({ status: 200, description: 'Room successfully deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async remove(@Param('id') id: string, @CurrentUser() user: JwtPayload, @Req() req: Request) {
    const userId = user.userId;
    const isOwner = await this.roomService.isOwner(id, userId);
    if (!isOwner) throw new ForbiddenException('Only the owner can delete the room');
    return this.roomService.remove(id);
  }
}
