import { AuthGuard } from '@nestjs/passport';
import { AUTH_STRATEGY } from '../../constants/strategies.enum';

export class LocalAuthGuard extends AuthGuard(AUTH_STRATEGY.LOCAL) {}
