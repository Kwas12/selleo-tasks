import { TypeOrmModule } from '@nestjs/typeorm';

export const TypeORMMySqlTestingModule = (entities: any[]) =>
  TypeOrmModule.forRoot({
    type: process.env.TYPE_DB as 'sqlite',
    database: 'db/tests',
    synchronize: true,
    entities: [...entities],
    dropSchema: true,
  });
