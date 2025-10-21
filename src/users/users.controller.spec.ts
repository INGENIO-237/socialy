import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { randomUUID } from 'crypto';
import { UserResponse } from './dtos/user-response';

describe('UsersController', () => {
  let controller: UsersController;

  const serviceMock = {
    findAll: jest.fn(),
    create: jest.fn(),
  };

  const users: UserResponse[] = [
    {
      id: randomUUID(),
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@doe.com',
    },
    {
      id: randomUUID(),
      firstname: 'Jane',
      lastname: 'Doe',
      email: 'jane@doe.com',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  describe('findAll', () => {
    it('should retrieve paginated data', async () => {
      serviceMock.findAll.mockResolvedValue({
        data: users,
        metadata: {
          page: 1,
          limit: 10,
          pages: 1,
        },
      });

      const result = await controller.findAll({
        page: 1,
        limit: 10,
      });

      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('metadata');
      expect(result).toHaveProperty('status');
      expect(result.data).toEqual(users);
    });

    it('should return 2 pages when limit is 1', async () => {
      serviceMock.findAll.mockResolvedValue({
        data: [users[0]],
        metadata: {
          page: 1,
          limit: 1,
          pages: 2,
          total: users.length,
        },
      });

      const result = await controller.findAll({
        page: 1,
        limit: 1,
      });

      expect(result.metadata.limit).toBe(1);
      expect(result.metadata.pages).toBe(2);
      expect(result.metadata.total).toBe(2);
    });
  });
});
