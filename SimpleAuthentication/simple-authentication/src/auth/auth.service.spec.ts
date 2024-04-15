import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { TypeORMMySqlTestingModule } from '../../test/TypeORMMySqlTestingModule';
import { User } from '../users/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessTokenStrategy } from './AccessTokenStrategy';
import { RefreshTokenStrategy } from './RefreshTokenStrategy';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { LoginDTO } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { sign } from 'jsonwebtoken';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  const refreshToken = sign({ sub: 'id', email: 'ala@ma.kota' }, 'test');

  const usersServiceMockFactory = () => ({
    findOne: async (loginDTO: LoginDTO) => {
      if (loginDTO.password == null || loginDTO.password.length === 0) {
        return null;
      }
      const password = await argon2.hash(loginDTO.password);
      return Promise.resolve({ email: loginDTO.email, password: password });
    },
    updateToken: async (userId: string, refreshToken: string) => {
      userId + refreshToken;
    },
    findOneById: async (userId: string) => {
      const hashedRefreshToken = await argon2.hash(refreshToken);
      if (userId == null || userId.length === 0) {
        return null;
      }
      return {
        userId: userId,
        refreshToken: hashedRefreshToken,
        email: 'ala@ma.kota',
      };
    },
  });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeORMMySqlTestingModule([User]),
        TypeOrmModule.forFeature([User]),
        ConfigModule.forRoot(),
        UsersModule,
        JwtModule.register({}),
      ],
      providers: [
        AuthService,
        {
          provide: UsersService,
          useFactory: usersServiceMockFactory,
        },
        AccessTokenStrategy,
        RefreshTokenStrategy,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(usersService).toBeDefined();
  });

  it('should login new user', async () => {
    const loginDTO = new LoginDTO();
    loginDTO.email = 'ala@ma.kota';
    loginDTO.password = '123';

    const user = await authService.login(loginDTO);

    expect(user).toEqual({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
  });

  it('should return error on login', async () => {
    try {
      const loginDTO = new LoginDTO();
      loginDTO.email = 'ala@ma.kota';
      loginDTO.password = '';

      await authService.login(loginDTO);
    } catch (err) {
      expect(err).toBeInstanceOf(UnauthorizedException);
    }
  });

  it('should refresh tokens', async () => {
    const tokens = await authService.refreshAuth('id', refreshToken);

    expect(tokens).toEqual({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
  });

  it('should refresh tokens return error', async () => {
    try {
      await authService.refreshAuth('', refreshToken);
    } catch (err) {
      expect(err).toBeInstanceOf(ForbiddenException);
    }
  });

  it('should refresh tokens with wrong token return error', async () => {
    try {
      await authService.refreshAuth('', '123');
    } catch (err) {
      expect(err).toBeInstanceOf(ForbiddenException);
    }
  });

  it('should return tokens', async () => {
    const tokens = await authService.getToken('id', 'ala@ma.kota');

    expect(tokens).toEqual({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
  });

  it('should return null on logout', async () => {
    const response = await authService.logout('id');

    expect(response).toEqual(null);
  });

  it('should return null on logout', async () => {
    try {
      await authService.logout('');
    } catch (err) {
      expect(err).toBeInstanceOf(UnauthorizedException);
    }
  });
});
