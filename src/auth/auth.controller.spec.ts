import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { AuthService } from '@/auth/auth.service'
import { UserService } from '@/user/user.service'
import { JwtPayload } from './interfaces/jwt-payload.interface'

describe('AuthController', () => {
  let controller: AuthController
  let authService: AuthService
  let userService: UserService

  const mockAuthService = {
    login: jest.fn().mockResolvedValue({ access_token: 'jwt-token' }),
  }

  const mockUserService = {
    getProfileByEmail: jest.fn().mockResolvedValue({
      id: '123',
      email: 'test@example.com',
      username: 'testuser',
    }),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile()

    controller = module.get<AuthController>(AuthController)
    authService = module.get<AuthService>(AuthService)
    userService = module.get<UserService>(UserService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should call authService.login with correct params and return token', async () => {
    const loginDto = { email: 'test@example.com', password: '123456' }

    const result = await controller.login(loginDto)

    expect(authService.login).toHaveBeenCalledWith(loginDto.email, loginDto.password)
    expect(result).toEqual({ access_token: 'jwt-token' })
  })

  it('should return user profile from userService', async () => {
    const userPayload: JwtPayload = {
      email: 'test@example.com',
      userId: '123',
    }

    const result = await controller.getProfile(userPayload)

    expect(userService.getProfileByEmail).toHaveBeenCalledWith(userPayload.email)
    expect(result).toEqual({
      id: '123',
      email: 'test@example.com',
      username: 'testuser',
    })
  })
})
