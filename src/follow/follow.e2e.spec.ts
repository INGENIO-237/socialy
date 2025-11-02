import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtAuthGuard } from 'src/auth/strategies/jwt/jwt-auth-guard';
import { User } from 'src/users/user.entity';
import request from 'supertest';
import { Repository } from 'typeorm';
import { Follow } from './follow.entity';
import { FollowModule } from './follow.module';

describe('FollowController (e2e)', () => {
  let app: INestApplication;
  let followRepository: Repository<Follow>;
  let userRepository: Repository<User>;

  const mockUser1 = { id: '1', firstname: 'John', lastname: 'Doe' };
  const mockUser2 = { id: '2', firstname: 'Jane', lastname: 'Smith' };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [FollowModule],
    })
      .overrideProvider(getRepositoryToken(Follow))
      .useValue({
        findOne: jest.fn(),
        find: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        remove: jest.fn(),
        count: jest.fn(),
      })
      .overrideProvider(getRepositoryToken(User))
      .useValue({
        findOne: jest.fn(),
      })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn((context) => {
          const request = context.switchToHttp().getRequest();
          request.user = { id: '1' };
          return true;
        }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    followRepository = moduleFixture.get<Repository<Follow>>(
      getRepositoryToken(Follow),
    );
    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/follow/:id (POST)', () => {
    it('should follow user successfully', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValueOnce(mockUser1 as User)
        .mockResolvedValueOnce(mockUser2 as User);
      jest.spyOn(followRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(followRepository, 'create').mockReturnValue({} as Follow);
      jest.spyOn(followRepository, 'save').mockResolvedValue({} as Follow);

      const response = await request(app.getHttpServer())
        .post('/follow/2')
        .send({})
        .expect(201);

      expect(response.body).toEqual({
        data: null,
        message: 'User followed successfully',
        status: 201,
      });
    });
  });

  describe('/follow/:id (DELETE)', () => {
    it('should unfollow user successfully', async () => {
      jest.spyOn(followRepository, 'findOne').mockResolvedValue({} as Follow);
      jest.spyOn(followRepository, 'remove').mockResolvedValue({} as Follow);

      const response = await request(app.getHttpServer())
        .delete('/follow/2')
        .expect(200);

      expect(response.body).toEqual({
        data: null,
        message: 'User unfollowed successfully',
        status: 200,
      });
    });
  });

  describe('/follow/:id/followers (GET)', () => {
    it('should return paginated followers list', async () => {
      jest
        .spyOn(followRepository, 'find')
        .mockResolvedValue([{ follower: mockUser1 } as Follow]);
      jest.spyOn(followRepository, 'count').mockResolvedValue(1);

      const response = await request(app.getHttpServer())
        .get('/follow/2/followers?page=1&limit=10')
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(response.body.metadata).toBeDefined();
      expect(response.body.message).toBe('Followers retrieved successfully');
    });
  });

  describe('/follow/:id/counts (GET)', () => {
    it('should return follow counts', async () => {
      jest
        .spyOn(followRepository, 'count')
        .mockResolvedValueOnce(5)
        .mockResolvedValueOnce(3);

      const response = await request(app.getHttpServer())
        .get('/follow/1/counts')
        .expect(200);

      expect(response.body).toEqual({
        data: { followers: 5, following: 3 },
        message: 'Follow counts retrieved successfully',
        status: 200,
      });
    });
  });
});
