import { Body, Controller, Get, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiResponse } from 'src/utils/base/response/api-response';
import { PaginatedApiResponse } from 'src/utils/base/response/paginated-api-response';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersQueryDto } from './dtos/get-users-query.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  async findAll(
    @Query() query: GetUsersQueryDto,
  ): Promise<PaginatedApiResponse<User>> {
    const result = await this.service.findAll(query);

    return { ...result, message: 'Users retrieved successfully' };
  }

  @Post()
  async create(@Body() payload: CreateUserDto): Promise<ApiResponse<User>> {
    const result = await this.service.create(payload);

    return {
      data: result,
      message: 'User created successfully',
      status: HttpStatus.CREATED,
    };
  }
}
