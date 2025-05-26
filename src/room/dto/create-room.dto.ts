import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ example: 'Friends Group', description: 'Room name' })
  @IsString()
  @Length(1, 100)
  name: string;
}
