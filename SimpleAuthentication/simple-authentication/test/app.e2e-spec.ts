import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateUserDTO } from '../src/users/dto/createUser.dto';
import { LoginDTO } from '../src/auth/dto/login.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let refreshToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/auth/sing-up (POST) add new user', async () => {
    const userDTO = new CreateUserDTO();
    userDTO.email = 'albert@bat.pl';
    userDTO.password = 'ezof';
    userDTO.firstName = 'albert';
    userDTO.lastName = 'azale';
    userDTO.phoneNumber = '+48123123123';
    userDTO.shirtSize = 42;
    userDTO.preferredTechnology = 'Node.js';

    const res = await request(app.getHttpServer())
      .post('/auth/sing-up')
      .set('Content-type', 'application/json')
      .send(userDTO)
      .expect(201);

    expect(res.body).toEqual(
      expect.objectContaining({
        email: 'albert@bat.pl',
        firstName: 'albert',
        lastName: 'azale',
        phoneNumber: '+48123123123',
        shirtSize: 42,
        preferredTechnology: 'Node.js',
        id: expect.any(String),
      }),
    );
  });

  it('/auth/sing-up (POST) add new user again', async () => {
    const userDTO = new CreateUserDTO();
    userDTO.email = 'albert@bat.pl';
    userDTO.password = 'ezof';

    const res = await request(app.getHttpServer())
      .post('/auth/sing-up')
      .set('Content-type', 'application/json')
      .send(userDTO)
      .expect(409);

    expect(res.body).toEqual(
      expect.objectContaining({
        error: 'Conflict',
        message: 'User Exists',
        statusCode: 409,
      }),
    );
  });

  it('/auth/sing-up (POST) add new user with wrong email', async () => {
    const userDTO = new CreateUserDTO();
    userDTO.email = 'albertbat.pl';
    userDTO.password = 'ezof';

    const res = await request(app.getHttpServer())
      .post('/auth/sing-up')
      .set('Content-type', 'application/json')
      .send(userDTO)
      .expect(400);

    expect(res.body).toEqual(
      expect.objectContaining({
        error: 'Bad Request',
        message: ['email must be an email'],
      }),
    );
  });

  it('/auth/login (POST) login', async () => {
    const userDTO = new LoginDTO();
    userDTO.email = 'albert@bat.pl';
    userDTO.password = 'ezof';

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .set('Content-type', 'application/json')
      .send(userDTO)
      .expect(201);

    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;

    expect(res.body).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      }),
    );
  });

  it('/auth/login (POST) login with wrong password', async () => {
    const userDTO = new LoginDTO();
    userDTO.email = 'albert@bat.pl';
    userDTO.password = 'wrong';

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .set('Content-type', 'application/json')
      .send(userDTO)
      .expect(401);

    expect(res.body).toEqual(
      expect.objectContaining({
        error: 'Unauthorized',
        message: 'Incorrect Data',
        statusCode: 401,
      }),
    );
  });

  it('/auth/login (POST) login with wrong email', async () => {
    const userDTO = new LoginDTO();
    userDTO.email = 'abert@bat.pl';
    userDTO.password = 'ezof';

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .set('Content-type', 'application/json')
      .send(userDTO)
      .expect(401);

    expect(res.body).toEqual(
      expect.objectContaining({
        error: 'Unauthorized',
        message: 'Incorrect Data',
        statusCode: 401,
      }),
    );
  });

  it('/auth/req-auth (GET) Refresh Token', async () => {
    const res = await request(app.getHttpServer())
      .get('/auth/req-auth ')
      .set('Authorization', `Bearer ${refreshToken}`)
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      }),
    );
  });

  it('/auth/req-auth (GET) Refresh Token with incorrect token', async () => {
    const res = await request(app.getHttpServer())
      .get('/auth/req-auth ')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(401);

    expect(res.body).toEqual(
      expect.objectContaining({
        message: 'Unauthorized',
        statusCode: 401,
      }),
    );
  });

  it('/auth/req-auth (GET) Refresh Token with old Refresh Token', async () => {
    const res = await request(app.getHttpServer())
      .get('/auth/req-auth ')
      .set('Authorization', `Bearer ${refreshToken}`)
      .expect(403);

    expect(res.body).toEqual(
      expect.objectContaining({
        message: 'Forbidden',
        statusCode: 403,
      }),
    );
  });

  it('/users (GET) Users', async () => {
    const res = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining([
        {
          email: 'albert@bat.pl',
          firstName: 'albert',
          lastName: 'azale',
          phoneNumber: '+48123123123',
          shirtSize: 42,
          preferredTechnology: 'Node.js',
          id: expect.any(String),
        },
      ]),
    );
  });

  it('/users (GET) Users without access token', async () => {
    const res = await request(app.getHttpServer()).get('/users').expect(401);

    expect(res.body).toEqual(
      expect.objectContaining({
        message: 'Unauthorized',
        statusCode: 401,
      }),
    );
  });

  it('/auth/logout (GET) Logout', async () => {
    await request(app.getHttpServer())
      .get('/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });

  it('/auth/req-auth (GET) Try refresh token after logout', async () => {
    const res = await request(app.getHttpServer())
      .get('/auth/req-auth')
      .set('Authorization', `Bearer ${refreshToken}`)
      .expect(403);

    expect(res.body).toEqual(
      expect.objectContaining({
        message: 'Forbidden',
        statusCode: 403,
      }),
    );
  });
});
