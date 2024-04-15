import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { AuthModule } from './auth/auth.module';

declare global {
  interface Request {
    user?: {
      userId: string;
      email: string;
      sub: string;
      refreshToken: string;
    };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? `test.env` : `.env`,
    }),
    TypeOrmModule.forRoot({
      type: process.env.TYPE_DB as 'sqlite',
      database: process.env.DATABASE_NAME,
      synchronize: true,
      entities: [User],
      dropSchema: !!process.env.DROP_SCHEMA,
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
