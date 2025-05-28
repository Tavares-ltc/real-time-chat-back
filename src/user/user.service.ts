import * as bcrypt from 'bcrypt'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { CreateUserDto } from '@/user/dto/create-user.dto'
import { UserDto } from './dto/user.dto'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10)

    const data: any = {
      username: createUserDto.username,
      email: createUserDto.email,
      password: hashedPassword,
    }

    if (createUserDto.image) {
      data.img = createUserDto.image
    }

    const user = await this.prisma.user.create({
      data,
    })

    return user
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    })
  }

    toUserDto(user: any): UserDto {
    if (!user) {
      throw new Error('User not found');
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getProfileByEmail(email: string): Promise<UserDto> {
    const user = await this.findByEmail(email);
    return this.toUserDto(user);
  }
}
