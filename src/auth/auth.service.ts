import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserResponse } from 'src/users/dtos/user-response';
import { UsersMapper } from 'src/users/users-mapper';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from './types/jwt-payload';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly usersMapper: UsersMapper,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserResponse | null> {
    try {
      const user = await this.usersService.findByEmail(email);

      const validPassword = await user.validatePassword(password);
      if (user && validPassword) {
        return this.usersMapper.toUserResponse(user);
      }

      return null;
    } catch (error) {
      this.logger.error(error);

      return null;
    }
  }

  login(user: UserResponse) {
    const { id, ...data } = user;

    const accessToken = this.jwtService.sign({
      sub: id,
      ...data,
    } as JwtPayload);

    return accessToken;
  }
}
