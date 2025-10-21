import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { ApiResponse } from 'src/utils/base/response/api-response';
import { PaginatedApiResponse } from 'src/utils/base/response/paginated-api-response';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersQueryDto } from './dtos/get-users-query.dto';
import { UserResponse } from './dtos/user-response';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: GetUsersQueryDto,
  ): Promise<PaginatedApiResponse<UserResponse>> {
    const result = await this.service.findAll(query);

    const response = new PaginatedApiResponse<UserResponse>();

    response.data = result.data;
    response.metadata = result.metadata;
    response.message = 'Users retrieved successfully';

    return response;
  }

  @Post()
  async create(
    @Body() payload: CreateUserDto,
  ): Promise<ApiResponse<UserResponse>> {
    const result = await this.service.create(payload);

    return {
      data: result,
      message: 'User created successfully',
      status: HttpStatus.CREATED,
    };
  }
}
