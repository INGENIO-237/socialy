import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AUTH_STRATEGY } from 'src/auth/constants/strategies.enum';

@Injectable()
export class JwtAuthGuard extends AuthGuard(AUTH_STRATEGY.JWT) {}
