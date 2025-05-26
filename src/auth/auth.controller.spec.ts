import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '@/auth/auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn().mockResolvedValue({ access_token: 'jwt-token' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call authService.login with correct params and return token', async () => {
    const loginDto = { email: 'test@example.com', password: '123456' };

    const result = await controller.login(loginDto);

    expect(authService.login).toHaveBeenCalledWith(loginDto.email, loginDto.password);
    expect(result).toEqual({ access_token: 'jwt-token' });
  });
});
