/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/strategies/jwt/jwt-auth-guard';
import { ApiResponse } from 'src/utils/base/response/api-response';
import { PaginatedApiResponse } from 'src/utils/base/response/paginated-api-response';
import { GetFollowersQueryDto } from './dtos/get-followers-query.dto';
import { GetFollowingQueryDto } from './dtos/get-following-query.dto';
import { UserFollowResponse } from './dtos/user-follow.dto';
import { FollowCountsResponse } from './dtos/follow-counts.dto';
import { FollowService } from './follow.service';

@Controller('follow')
@UseGuards(JwtAuthGuard)
export class FollowController {
  constructor(private readonly service: FollowService) {}

  @Post(':id')
  async followUser(
    @Param('id') followeeId: string,
    @Request() req,
  ): Promise<ApiResponse<null>> {
    await this.service.followUser(req.user.id, followeeId);

    return {
      data: null,
      message: 'User followed successfully',
      status: HttpStatus.CREATED,
    };
  }

  @Delete(':id')
  async unfollowUser(
    @Param('id') followeeId: string,
    @Request() req,
  ): Promise<ApiResponse<null>> {
    await this.service.unfollowUser(req.user.id, followeeId);

    return {
      data: null,
      message: 'User unfollowed successfully',
      status: HttpStatus.OK,
    };
  }

  @Get(':id/followers')
  @HttpCode(HttpStatus.OK)
  async getFollowers(
    @Param('id') userId: string,
    @Query() query: GetFollowersQueryDto,
  ): Promise<PaginatedApiResponse<UserFollowResponse>> {
    const result = await this.service.getFollowers(userId, query);

    const response = new PaginatedApiResponse<UserFollowResponse>();
    response.data = result.data;
    response.metadata = result.metadata;
    response.message = 'Followers retrieved successfully';

    return response;
  }

  @Get(':id/following')
  @HttpCode(HttpStatus.OK)
  async getFollowing(
    @Param('id') userId: string,
    @Query() query: GetFollowingQueryDto,
  ): Promise<PaginatedApiResponse<UserFollowResponse>> {
    const result = await this.service.getFollowing(userId, query);

    const response = new PaginatedApiResponse<UserFollowResponse>();
    response.data = result.data;
    response.metadata = result.metadata;
    response.message = 'Following retrieved successfully';

    return response;
  }

  @Get(':id/status')
  async getFollowStatus(
    @Param('id') followeeId: string,
    @Request() req,
  ): Promise<ApiResponse<{ isFollowing: boolean }>> {
    const isFollowing = await this.service.isFollowing(req.user.id, followeeId);

    return {
      data: { isFollowing },
      message: 'Follow status retrieved successfully',
      status: HttpStatus.OK,
    };
  }

  @Get(':id/counts')
  async getFollowCounts(
    @Param('id') userId: string,
  ): Promise<ApiResponse<FollowCountsResponse>> {
    const result = await this.service.getFollowCounts(userId);

    return {
      data: result,
      message: 'Follow counts retrieved successfully',
      status: HttpStatus.OK,
    };
  }
}
