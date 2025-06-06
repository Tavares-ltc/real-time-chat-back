import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'john_doe', description: 'Unique username' })
  username: string;

  @ApiProperty({ example: 'john@example.com', description: 'User email address' })
  email: string;

  @ApiProperty({ example: 'strongPassword123', description: 'User password' })
  password: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.png', description: 'URL of user profile image' })
  image?: string;
}
