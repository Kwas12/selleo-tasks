import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { TypeORMMySqlTestingModule } from '../../test/TypeORMMySqlTestingModule';
import { UsersService } from './users.service';
import { ConfigModule } from '@nestjs/config';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeORMMySqlTestingModule([User]),
        TypeOrmModule.forFeature([User]),
      ],
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersController = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
    expect(usersController).toBeDefined();
  });

  it('should return an array of Users', async () => {
    const user = new User();
    user.email = 'asd@asd.pl';
    user.firstName = 'ala';
    user.lastName = 'have';
    user.phoneNumber = '123456789';
    user.preferredTechnology = 'Nestjs';
    user.shirtSize = 32;

    const result = new Promise<User[]>((resolve) => resolve([user]));
    jest.spyOn(usersService, 'findAll').mockImplementation(() => result);

    expect(await usersController.findUsers()).toBe(await result);
  });
});
