import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/auth/types/jwt-payload';
import { JwtUser } from 'src/auth/types/jwt-user';
import { jwtOptions } from 'src/configs/jwt.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtOptions.secret as string,
    });
  }

  validate(payload: JwtPayload): JwtUser {
    return { userId: payload.sub, email: payload.email };
  }
}
