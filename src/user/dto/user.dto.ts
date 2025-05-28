import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false })
  img?: string | null;

  @ApiProperty()
  createdAt: Date;

  constructor(partial: Partial<UserDto & { password?: string }>) {
    const { password, ...safe } = partial;
    Object.assign(this, safe);
  }
}
