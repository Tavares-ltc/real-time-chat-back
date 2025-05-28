import { IsEmail, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomUserDto {
  @ApiProperty({ description: 'ID of the user to add to the room' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'ID of the room' })
  @IsUUID()
  roomId: string;
}
