import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { File } from './file.entity';

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
      entities: [File],
      dropSchema: !!process.env.DROP_SCHEMA,
    }),
    TypeOrmModule.forFeature([File]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
