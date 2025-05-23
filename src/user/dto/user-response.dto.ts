import { ApiProperty } from "@nestjs/swagger";

export class UserResponseDto {
  @ApiProperty({ example: 'a3e1b2d4-5678-90ab-cdef-1234567890ab', description: 'User unique identifier' })
  id: string;

  @ApiProperty({ example: 'username', description: 'Unique username' })
  username: string;

  @ApiProperty({ example: 'user@email.com', description: 'User email address' })
  email: string;

  @ApiProperty({ example: '2025-05-22T22:13:56.000Z', description: 'Date when user was created' })
  createdAt: Date;
}