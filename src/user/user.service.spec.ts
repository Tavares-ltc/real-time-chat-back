import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should hash the password and create a user', async () => {
    const createUserDto: CreateUserDto = {
      username: 'john_doe',
      email: 'john@example.com',
      password: 'password123',
    };

    const hashedPassword = 'hashed_password';

    jest.spyOn(bcrypt, 'hash').mockImplementation(async () => hashedPassword);

    const mockUser = {
      id: 'uuid',
      username: createUserDto.username,
      email: createUserDto.email,
      password: hashedPassword,
      createdAt: new Date(),
    };

    (prisma.user.create as jest.Mock).mockResolvedValueOnce(mockUser);

    const result = await service.create(createUserDto);

    expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        username: createUserDto.username,
        email: createUserDto.email,
        password: hashedPassword,
      },
    });
    expect(result).toEqual(mockUser);
  });
});
