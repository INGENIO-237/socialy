import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export enum ENV {
  DEV = 'development',
  PROD = 'production',
  TEST = 'test',
}

const databaseOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT as string, 10) || 5432,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== ENV.PROD ? true : false,
};

export const env = {
  type: process.env.NODE_ENV,
  database: databaseOptions,
};
