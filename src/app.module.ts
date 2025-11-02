import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from './configs/env.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FollowModule } from './follow/follow.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({ ...env.database }),
    UsersModule,
    AuthModule,
    FollowModule,
  ],
})
export class AppModule {}
