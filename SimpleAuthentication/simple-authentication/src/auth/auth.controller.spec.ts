import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeORMMySqlTestingModule } from '../../test/TypeORMMySqlTestingModule';
import { User } from '../users/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { RefreshTokenStrategy } from './RefreshTokenStrategy';
import { LoginDTO } from './dto/login.dto';
import { JWTTokens } from './types';
import { CreateUserDTO } from '../users/dto/createUser.dto';
import { UsersService } from '../users/users.service';
import { AuthModule } from './auth.module';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeORMMySqlTestingModule([User]),
        TypeOrmModule.forFeature([User]),
        ConfigModule.forRoot(),
        UsersModule,
        AuthModule,
        JwtModule.register({}),
      ],
      controllers: [AuthController],
      providers: [AuthService, RefreshTokenStrategy, UsersService],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(authService).toBeDefined();
    expect(usersService).toBeDefined();
  });

  it('should login user', async () => {
    const loginDTO = new LoginDTO();
    loginDTO.email = 'ala@ma.kota';
    loginDTO.password = '';

    const tokens = {
      accessToken: '123',
      refreshToken: '123',
    };

    const result = new Promise<JWTTokens>((resolve) => resolve(tokens));
    jest.spyOn(authService, 'login').mockImplementation(() => result);

    expect(await authController.login(loginDTO)).toBe(await result);
  });

  it('should refresh refresh Token', async () => {
    const loginDTO = new LoginDTO();
    loginDTO.email = 'ala@ma.kota';
    loginDTO.password = '';

    const tokens = {
      accessToken: '123',
      refreshToken: '123',
    };

    const req = { user: { sub: 'userId', refreshToken: '123' } } as Request;

    const result = new Promise<JWTTokens>((resolve) => resolve(tokens));
    jest.spyOn(authService, 'refreshAuth').mockImplementation(() => result);

    expect(await authController.refAuth(req)).toBe(await result);
  });

  it('should create User', async () => {
    const createUserDTO = new CreateUserDTO();
    createUserDTO.email = 'ala@ma.kota';
    createUserDTO.password = '123';

    const newUser = await authController.singUp(createUserDTO);

    expect(newUser).toEqual({
      email: 'ala@ma.kota',
      firstName: null,
      id: expect.any(String),
      lastName: null,
      phoneNumber: null,
      preferredTechnology: null,
      shirtSize: null,
    });
  });

  it('should logout User', async () => {
    const createUserDTO = new CreateUserDTO();
    createUserDTO.email = 'ala@ma.kota';
    createUserDTO.password = '123';

    const req = { user: { sub: 'userId', refreshToken: '123' } } as Request;

    const result = new Promise<null>((resolve) => resolve(null));
    jest.spyOn(authService, 'logout').mockImplementation(() => result);

    const newUser = await authController.logout(req);

    expect(newUser).toEqual(null);
  });
});
