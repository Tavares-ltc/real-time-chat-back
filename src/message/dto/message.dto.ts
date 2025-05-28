import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '@/user/dto/user.dto';

export class MessageDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  roomId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: () => UserDto })
  user: UserDto;

  constructor(partial: Partial<MessageDto>) {
    Object.assign(this, partial);
  }
}
