import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtOptions } from 'src/configs/jwt.config';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt/jwt-strategy.ts';
import { LocalStrategy } from './strategies/local/local-strategy';
import { JwtAuthGuard } from './strategies/jwt/jwt-auth-guard';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      ...jwtOptions,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtAuthGuard],
})
export class AuthModule {}
