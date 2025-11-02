import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationMetadata } from 'src/utils/base/pagination/dtos/pagination-metadata.dto';
import { PaginatedData } from 'src/utils/base/response/paginated-data';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersQueryDto } from './dtos/get-users-query.dto';
import { UserResponse } from './dtos/user-response';
import { User } from './user.entity';
import { UsersMapper } from './users-mapper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
    private readonly mapper: UsersMapper,
  ) {}

  async findAll(query: GetUsersQueryDto): Promise<PaginatedData<UserResponse>> {
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

    return { data: this.mapper.toUserResponseList(result), metadata };
  }

  async create(payload: CreateUserDto): Promise<UserResponse> {
    const existingUser = await this.repository.findOne({
      where: {
        email: payload.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = this.repository.create(payload);
    const createdUser = await this.repository.save(user);

    const userResponse = this.mapper.toUserResponse(createdUser);

    return userResponse;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.repository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
