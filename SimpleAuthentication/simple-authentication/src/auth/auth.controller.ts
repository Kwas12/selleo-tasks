import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { AccessTokenGuard } from './accessToken.guard';
import { JWTTokens } from './types';
import { RefreshTokenGuard } from './refreshToken.guard';
import { CreateUserDTO } from '../users/dto/createUser.dto';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authServices: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  login(
    @Body()
    loginDTO: LoginDTO,
  ) {
    return this.authServices.login(loginDTO);
  }

  @Get('logout')
  @UseGuards(AccessTokenGuard)
  logout(
    @Req()
    req: Request,
  ) {
    return this.authServices.logout(req.user!.userId);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('req-auth')
  refAuth(@Req() req: Request): Promise<JWTTokens> {
    const userId = req.user!.sub;
    const refreshToken = req.user!.refreshToken;
    return this.authServices.refreshAuth(userId, refreshToken);
  }

  @Post('sing-up')
  singUp(
    @Body()
    userDTO: CreateUserDTO,
  ): Promise<Partial<User>> {
    return this.usersService.create(userDTO);
  }
}
