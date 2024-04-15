import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { TypeORMMySqlTestingModule } from '../../test/TypeORMMySqlTestingModule';
import { ConfigModule } from '@nestjs/config';
import { CreateUserDTO } from './dto/createUser.dto';
import { LoginDTO } from '../auth/dto/login.dto';
import { ConflictException } from '@nestjs/common';

describe('UsersService', () => {
  let usersService: UsersService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeORMMySqlTestingModule([User]),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [UsersService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  it('should get Empty array users', async () => {
    const users = await usersService.findAll();

    expect(users).toStrictEqual([]);
  });

  it('should crate new user', async () => {
    const createUserDTO = new CreateUserDTO();
    createUserDTO.email = 'ala@ma.kota';
    createUserDTO.password = '123';

    const user = await usersService.create(createUserDTO);

    expect(user).toEqual({
      email: 'ala@ma.kota',
      firstName: null,
      id: expect.any(String),
      lastName: null,
      phoneNumber: null,
      preferredTechnology: null,
      shirtSize: null,
    });
  });

  it('should return error message on new user', async () => {
    const createUserDTO = new CreateUserDTO();
    createUserDTO.email = 'ala@ma.kota';
    createUserDTO.password = '123';

    try {
      await usersService.create(createUserDTO);
    } catch (err) {
      expect(err).toBeInstanceOf(ConflictException);
    }
  });

  it('should get array with one user', async () => {
    const users = await usersService.findAll();

    expect(users).toEqual([
      {
        email: 'ala@ma.kota',
        firstName: null,
        id: expect.any(String),
        lastName: null,
        phoneNumber: null,
        preferredTechnology: null,
        shirtSize: null,
      },
    ]);
  });

  it('should get user by email', async () => {
    const loginDTO = new LoginDTO();
    loginDTO.email = 'ala@ma.kota';
    loginDTO.password = '123';
    const user = await usersService.findOne(loginDTO);

    expect(user).toEqual({
      email: 'ala@ma.kota',
      firstName: null,
      id: expect.any(String),
      lastName: null,
      password: expect.any(String),
      phoneNumber: null,
      preferredTechnology: null,
      shirtSize: null,
      refreshToken: null,
    });
  });

  it('should get user by id', async () => {
    const loginDTO = new LoginDTO();
    loginDTO.email = 'ala@ma.kota';
    loginDTO.password = '123';
    const user = await usersService.findOne(loginDTO);

    const usersById = await usersService.findOneById(user!.id);

    expect(usersById).toEqual({
      email: 'ala@ma.kota',
      firstName: null,
      id: expect.any(String),
      lastName: null,
      password: expect.any(String),
      phoneNumber: null,
      preferredTechnology: null,
      shirtSize: null,
      refreshToken: null,
    });
  });

  it('should update Token', async () => {
    const loginDTO = new LoginDTO();
    loginDTO.email = 'ala@ma.kota';
    loginDTO.password = '123';
    const user = await usersService.findOne(loginDTO);

    await usersService.updateToken(user!.id, 'ala');

    const userWithNewToken = await usersService.findOne(loginDTO);

    expect(userWithNewToken).toEqual({
      email: 'ala@ma.kota',
      firstName: null,
      id: expect.any(String),
      lastName: null,
      password: expect.any(String),
      phoneNumber: null,
      preferredTechnology: null,
      shirtSize: null,
      refreshToken: expect.any(String),
    });
  });
});
