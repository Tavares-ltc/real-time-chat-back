import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/auth/interfaces/jwt-payload.interface';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { RoomUserService } from '@/room-user/room-user.service';

@ApiTags('messages')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly roomUserService: RoomUserService
  ) {}

  @Get('room/:roomId')
  @ApiOperation({ summary: 'List messages from a room' })
  async findAll(
    @Param('roomId') roomId: string,
    @CurrentUser() user: JwtPayload
  ) {
        const isUserInRoom = await this.roomUserService.isUserInRoom(roomId, user.userId)
        if(!isUserInRoom){
           throw new UnauthorizedException()
        }
    return this.messageService.findAllByRoom(roomId);
  }
}
