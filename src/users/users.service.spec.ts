import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const repositoryMock = {
    find: jest.fn(),
    count: jest.fn(),
    save: jest.fn(),
  };

  const users: User[] = [
    {
      id: randomUUID(),
      firstname: 'John',
      lastname: 'Doe',
      password: 'some-dummy-password',
      email: 'john@doe.com',
    },
    {
      id: randomUUID(),
      firstname: 'Jane',
      lastname: 'Doe',
      password: 'some-dummy-password',
      email: 'jane@doe.com',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('findAll', () => {
    it('should return a list of 2 users', async () => {
      repositoryMock.find.mockResolvedValue(users);
      repositoryMock.count.mockResolvedValue(users.length);

      const result = await service.findAll({
        page: 1,
        limit: 10,
      });

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('metadata');
      expect(result.data).toEqual(users);
      expect(result.metadata.total).toBe(users.length);
    });
  });
});
