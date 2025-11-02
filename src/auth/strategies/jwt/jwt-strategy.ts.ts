import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/auth/types/jwt-payload';
import { jwtOptions } from 'src/configs/jwt.config';
import { UserResponse } from 'src/users/dtos/user-response';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtOptions.secret as string,
    });
  }

  validate(payload: JwtPayload): UserResponse {
    const { sub, ...rest } = payload;
    return { id: sub, ...rest };
  }
}
