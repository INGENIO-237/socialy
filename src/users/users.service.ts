import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationMetadata } from 'src/utils/base/pagination/dtos/pagination-metadata.dto';
import { PaginatedData } from 'src/utils/base/response/paginated-data';
import { Repository } from 'typeorm';
import { GetUsersQueryDto } from './dtos/get-users-query.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}

  async findAll(query: GetUsersQueryDto): Promise<PaginatedData<User>> {
    const { page, limit, ...filter } = query;

    const skip = (page - 1) * limit;

    const [result, total] = await Promise.all([
      this.repository.find({
        where: { ...filter },
        skip,
        take: limit,
      }),
      this.repository.count({ where: { ...filter } }),
    ]);

    const metadata: PaginationMetadata = {
      page,
      limit,
      pages: Math.ceil(total / limit),
      total,
    };

    return { data: result, metadata };
  }
}
