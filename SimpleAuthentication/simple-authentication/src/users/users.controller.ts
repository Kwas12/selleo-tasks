import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { AccessTokenGuard } from '../auth/accessToken.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  async findUsers(): Promise<User[]> {
    return await this.usersService.findAll();
  }
}
