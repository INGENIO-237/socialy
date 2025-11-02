import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { PaginationMetadata } from 'src/utils/base/pagination/dtos/pagination-metadata.dto';
import { PaginatedData } from 'src/utils/base/response/paginated-data';
import { Repository } from 'typeorm';
import { FollowCountsResponse } from './dtos/follow-counts.dto';
import { GetFollowersQueryDto } from './dtos/get-followers-query.dto';
import { GetFollowingQueryDto } from './dtos/get-following-query.dto';
import { UserFollowResponse } from './dtos/user-follow.dto';
import { FollowMapper } from './follow-mapper';
import { Follow } from './follow.entity';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private mapper: FollowMapper,
  ) {}

  async followUser(followerId: string, followeeId: string): Promise<void> {
    if (followerId === followeeId) {
      throw new BadRequestException('Cannot follow yourself');
    }

    const [follower, followee] = await Promise.all([
      this.userRepository.findOne({ where: { id: followerId } }),
      this.userRepository.findOne({ where: { id: followeeId } }),
    ]);

    if (!follower || !followee) {
      throw new NotFoundException('User not found');
    }

    const existingFollow = await this.followRepository.findOne({
      where: { follower: { id: followerId }, followee: { id: followeeId } },
    });

    if (existingFollow) {
      throw new BadRequestException('Already following this user');
    }

    const follow = this.followRepository.create({
      follower,
      followee,
    });

    await this.followRepository.save(follow);
  }

  async unfollowUser(followerId: string, followeeId: string): Promise<void> {
    const follow = await this.followRepository.findOne({
      where: { follower: { id: followerId }, followee: { id: followeeId } },
    });

    if (!follow) {
      throw new NotFoundException('Follow relationship not found');
    }

    await this.followRepository.remove(follow);
  }

  async getFollowers(
    userId: string,
    query: GetFollowersQueryDto,
  ): Promise<PaginatedData<UserFollowResponse>> {
    const { page, limit } = query;
    const skip = (page - 1) * limit;

    const [follows, total] = await Promise.all([
      this.followRepository.find({
        where: { followee: { id: userId } },
        relations: ['follower'],
        skip,
        take: limit,
      }),
      this.followRepository.count({ where: { followee: { id: userId } } }),
    ]);

    const users = follows.map((follow) => follow.follower);
    const metadata: PaginationMetadata = {
      page,
      limit,
      pages: Math.ceil(total / limit),
      total,
    };

    return { data: this.mapper.toUserFollowResponseList(users), metadata };
  }

  async getFollowing(
    userId: string,
    query: GetFollowingQueryDto,
  ): Promise<PaginatedData<UserFollowResponse>> {
    const { page, limit } = query;
    const skip = (page - 1) * limit;

    const [follows, total] = await Promise.all([
      this.followRepository.find({
        where: { follower: { id: userId } },
        relations: ['followee'],
        skip,
        take: limit,
      }),
      this.followRepository.count({ where: { follower: { id: userId } } }),
    ]);

    const users = follows.map((follow) => follow.followee);
    const metadata: PaginationMetadata = {
      page,
      limit,
      pages: Math.ceil(total / limit),
      total,
    };

    return { data: this.mapper.toUserFollowResponseList(users), metadata };
  }

  async isFollowing(followerId: string, followeeId: string): Promise<boolean> {
    const follow = await this.followRepository.findOne({
      where: { follower: { id: followerId }, followee: { id: followeeId } },
    });

    return !!follow;
  }

  async getFollowCounts(userId: string): Promise<FollowCountsResponse> {
    const [followers, following] = await Promise.all([
      this.followRepository.count({ where: { followee: { id: userId } } }),
      this.followRepository.count({ where: { follower: { id: userId } } }),
    ]);

    const counts = new FollowCountsResponse();
    counts.followers = followers;
    counts.following = following;
    return counts;
  }
}
