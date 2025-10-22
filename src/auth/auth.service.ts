import { Injectable, Logger } from '@nestjs/common';
import { UsersMapper } from 'src/users/users-mapper';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly usersMapper: UsersMapper,
  ) {}

  async validateUser(email: string, password: string) {
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
}
