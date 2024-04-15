import * as argon2 from 'argon2';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { LoginDTO } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { JWTTokens } from './types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDTO: LoginDTO): Promise<JWTTokens> {
    const user = await this.userService.findOne(loginDTO);
    if (!user) {
      throw new UnauthorizedException('Incorrect Data');
    }
    const passwordMatched = await argon2.verify(
      user.password,
      loginDTO.password,
    );

    if (passwordMatched) {
      const tokens = await this.getToken(user.id, user.email);

      await this.userService.updateToken(user.id, tokens.refreshToken);

      return tokens;
    } else {
      throw new UnauthorizedException('Incorrect Data');
    }
  }

  async logout(userId: string): Promise<null> {
    const user = await this.userService.findOneById(userId);
    if (user) {
      await this.userService.updateToken(user.id, '');
      return null;
    } else {
      throw new UnauthorizedException('Logout Not Complete');
    }
  }

  async refreshAuth(userId: string, refreshToken: string): Promise<JWTTokens> {
    const user = await this.userService.findOneById(userId);

    if (user != null && user.refreshToken != null) {
      const refreshTokenMatched = await argon2.verify(
        user.refreshToken,
        refreshToken,
      );
      if (!refreshTokenMatched) {
        throw new ForbiddenException();
      }

      const tokens = await this.getToken(user.id, user.email);

      await this.userService.updateToken(user.id, tokens.refreshToken);

      return tokens;
    } else {
      throw new ForbiddenException();
    }
  }

  async getToken(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, time: new Date().getTime() },
        {
          secret: process.env.ACCESS_TOKEN_SECRET,
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, time: new Date().getTime() },
        {
          secret: process.env.REFRESH_TOKEN_SECRET,
          expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        },
      ),
    ]);
    return { accessToken, refreshToken };
  }
}
