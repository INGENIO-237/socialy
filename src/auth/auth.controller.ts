import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserResponse } from 'src/users/dtos/user-response';
import { ApiResponse } from 'src/utils/base/response/api-response';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login-response.dto';
import { LocalAuthGuard } from './strategies/local/local-auth-guard';
import { JwtAuthGuard } from './strategies/jwt/jwt-auth-guard';
import { JwtUser } from './types/jwt-user';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  login(@Request() req: any & { user: UserResponse }): ApiResponse<LoginDto> {
    const accessToken = this.service.login(req.user);

    return {
      message: 'Logged in successfully',
      data: {
        accessToken,
      },
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  profile(@Request() req: any): ApiResponse<JwtUser> {
    return {
      message: 'Profile retrieved successfully',
      data: req.user,
    };
  }
}
