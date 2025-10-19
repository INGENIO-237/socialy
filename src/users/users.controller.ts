import { Controller, Get, Query } from '@nestjs/common';
import { GetUsersQueryDto } from './dtos/get-users-query.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  async findAll(@Query() query: GetUsersQueryDto) {
    const result = await this.service.findAll(query);

    return result;
  }
}
