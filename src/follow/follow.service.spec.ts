import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { GetFollowersQueryDto } from './dtos/get-followers-query.dto';
import { FollowMapper } from './follow-mapper';
import { Follow } from './follow.entity';
import { FollowService } from './follow.service';

describe('FollowService', () => {
  let service: FollowService;
  let followRepository: jest.Mocked<Repository<Follow>>;
  let userRepository: jest.Mocked<Repository<User>>;

  const mockUser1 = { id: '1', firstname: 'John', lastname: 'Doe' } as User;
  const mockUser2 = { id: '2', firstname: 'Jane', lastname: 'Smith' } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FollowService,
        {
          provide: getRepositoryToken(Follow),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            count: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: FollowMapper,
          useValue: {
            toUserFollowResponseList: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FollowService>(FollowService);
    followRepository = module.get(getRepositoryToken(Follow));
    userRepository = module.get(getRepositoryToken(User));
  });

  describe('followUser', () => {
    it('should follow user successfully', async () => {
      userRepository.findOne
        .mockResolvedValueOnce(mockUser1)
        .mockResolvedValueOnce(mockUser2);
      followRepository.findOne.mockResolvedValue(null);
      followRepository.create.mockReturnValue({} as Follow);
      followRepository.save.mockResolvedValue({} as Follow);

      await service.followUser('1', '2');

      expect(followRepository.save).toHaveBeenCalled();
    });

    it('should throw error when trying to follow yourself', async () => {
      await expect(service.followUser('1', '1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw error when user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.followUser('1', '2')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw error when already following', async () => {
      userRepository.findOne
        .mockResolvedValueOnce(mockUser1)
        .mockResolvedValueOnce(mockUser2);
      followRepository.findOne.mockResolvedValue({} as Follow);

      await expect(service.followUser('1', '2')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('unfollowUser', () => {
    it('should unfollow user successfully', async () => {
      const mockFollow = {} as Follow;
      followRepository.findOne.mockResolvedValue(mockFollow);
      followRepository.remove.mockResolvedValue(mockFollow);

      await service.unfollowUser('1', '2');

      expect(followRepository.remove).toHaveBeenCalledWith(mockFollow);
    });

    it('should throw error when follow relationship not found', async () => {
      followRepository.findOne.mockResolvedValue(null);

      await expect(service.unfollowUser('1', '2')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getFollowers', () => {
    it('should return paginated followers list', async () => {
      const query: GetFollowersQueryDto = { page: 1, limit: 10 };
      const mockFollows = [{ follower: mockUser1 }] as Follow[];
      const mockMappedUsers = [{ id: '1', firstname: 'John', lastname: 'Doe' }];

      followRepository.find.mockResolvedValue(mockFollows);
      followRepository.count.mockResolvedValue(1);
      const mapper = service['mapper'];
      mapper.toUserFollowResponseList = jest
        .fn()
        .mockReturnValue(mockMappedUsers);

      const result = await service.getFollowers('1', query);

      expect(result.data).toEqual(mockMappedUsers);
      expect(result.metadata.total).toBe(1);
    });
  });

  describe('isFollowing', () => {
    it('should return true when following', async () => {
      followRepository.findOne.mockResolvedValue({} as Follow);

      const result = await service.isFollowing('1', '2');

      expect(result).toBe(true);
    });

    it('should return false when not following', async () => {
      followRepository.findOne.mockResolvedValue(null);

      const result = await service.isFollowing('1', '2');

      expect(result).toBe(false);
    });
  });

  describe('getFollowCounts', () => {
    it('should return follow counts', async () => {
      followRepository.count.mockResolvedValueOnce(5).mockResolvedValueOnce(3);

      const result = await service.getFollowCounts('1');

      expect(result.followers).toBe(5);
      expect(result.following).toBe(3);
    });
  });
});
