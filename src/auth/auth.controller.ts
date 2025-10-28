import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserResponse } from 'src/users/dtos/user-response';
import { ApiResponse } from 'src/utils/base/response/api-response';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './strategies/local/local-auth-guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  login(
    @Request() req: any & { user: UserResponse },
  ): ApiResponse<UserResponse> {
    return {
      message: 'Login successful',
      data: req.user,
    };
  }
}
