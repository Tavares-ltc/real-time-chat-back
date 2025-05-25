import * as bcrypt from 'bcrypt'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { CreateUserDto } from '@/user/dto/create-user.dto'

@Injectable()
export class UserService {
  constructor (private prisma: PrismaService) {}

  async create (createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10)
    const user = await this.prisma.user.create({
      data: {
        username: createUserDto.username,
        email: createUserDto.email,
        password: hashedPassword,
      },
    })
    return user
  }

async findByEmail(email: string) {
  return this.prisma.user.findUnique({
    where: { email },
  });
}

}
