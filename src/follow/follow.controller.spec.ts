import { Test, TestingModule } from '@nestjs/testing';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { UserFollowResponse } from './dtos/user-follow.dto';
import { GetFollowersQueryDto } from './dtos/get-followers-query.dto';
import { GetFollowingQueryDto } from './dtos/get-following-query.dto';
import { HttpStatus } from '@nestjs/common';

describe('FollowController', () => {
  let controller: FollowController;
  let service: jest.Mocked<FollowService>;

  const mockUserResponse = { id: '1', firstname: 'John', lastname: 'Doe' } as UserFollowResponse;
  const mockRequest = { user: { id: '1' } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FollowController],
      providers: [
        {
          provide: FollowService,
          useValue: {
            followUser: jest.fn(),
            unfollowUser: jest.fn(),
            getFollowers: jest.fn(),
            getFollowing: jest.fn(),
            isFollowing: jest.fn(),
            getFollowCounts: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FollowController>(FollowController);
    service = module.get(FollowService);
  });

  describe('followUser', () => {
    it('should follow user and return success response', async () => {
      service.followUser.mockResolvedValue();

      const result = await controller.followUser('2', mockRequest);

      expect(service.followUser).toHaveBeenCalledWith('1', '2');
      expect(result).toEqual({
        data: null,
        message: 'User followed successfully',
        status: HttpStatus.CREATED,
      });
    });
  });

  describe('unfollowUser', () => {
    it('should unfollow user and return success response', async () => {
      service.unfollowUser.mockResolvedValue();

      const result = await controller.unfollowUser('2', mockRequest);

      expect(service.unfollowUser).toHaveBeenCalledWith('1', '2');
      expect(result).toEqual({
        data: null,
        message: 'User unfollowed successfully',
        status: HttpStatus.OK,
      });
    });
  });

  describe('getFollowers', () => {
    it('should return paginated followers list', async () => {
      const query: GetFollowersQueryDto = { page: 1, limit: 10 };
      const mockPaginatedData = {
        data: [mockUserResponse],
        metadata: { page: 1, limit: 10, pages: 1, total: 1 },
      };
      service.getFollowers.mockResolvedValue(mockPaginatedData);

      const result = await controller.getFollowers('1', query);

      expect(service.getFollowers).toHaveBeenCalledWith('1', query);
      expect(result.data).toEqual([mockUserResponse]);
      expect(result.message).toBe('Followers retrieved successfully');
    });
  });

  describe('getFollowing', () => {
    it('should return paginated following list', async () => {
      const query: GetFollowingQueryDto = { page: 1, limit: 10 };
      const mockPaginatedData = {
        data: [mockUserResponse],
        metadata: { page: 1, limit: 10, pages: 1, total: 1 },
      };
      service.getFollowing.mockResolvedValue(mockPaginatedData);

      const result = await controller.getFollowing('1', query);

      expect(service.getFollowing).toHaveBeenCalledWith('1', query);
      expect(result.data).toEqual([mockUserResponse]);
      expect(result.message).toBe('Following retrieved successfully');
    });
  });

  describe('getFollowStatus', () => {
    it('should return follow status', async () => {
      service.isFollowing.mockResolvedValue(true);

      const result = await controller.getFollowStatus('2', mockRequest);

      expect(service.isFollowing).toHaveBeenCalledWith('1', '2');
      expect(result).toEqual({
        data: { isFollowing: true },
        message: 'Follow status retrieved successfully',
        status: HttpStatus.OK,
      });
    });
  });

  describe('getFollowCounts', () => {
    it('should return follow counts', async () => {
      const mockCounts = { followers: 5, following: 3 };
      service.getFollowCounts.mockResolvedValue(mockCounts);

      const result = await controller.getFollowCounts('1');

      expect(service.getFollowCounts).toHaveBeenCalledWith('1');
      expect(result).toEqual({
        data: mockCounts,
        message: 'Follow counts retrieved successfully',
        status: HttpStatus.OK,
      });
    });
  });
});
