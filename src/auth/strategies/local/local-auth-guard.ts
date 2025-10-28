import { AuthGuard } from '@nestjs/passport';
import { AUTH_STRATEGY } from '../strategies.eum';

export class LocalAuthGuard extends AuthGuard(AUTH_STRATEGY.LOCAL) {}
