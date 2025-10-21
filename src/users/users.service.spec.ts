import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserResponse } from './dtos/user-response';
import { User } from './user.entity';
import { UsersMapper } from './users-mapper';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const repositoryMock = {
    find: jest.fn(),
    count: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mapperMock = {
    toUserResponse: jest.fn(),
    toUserResponseList: jest.fn(),
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

  const userResponses: UserResponse[] = [
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
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: repositoryMock,
        },
        {
          provide: UsersMapper,
          useValue: mapperMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('findAll', () => {
    beforeEach(() => {
      repositoryMock.find.mockResolvedValue(users);
      repositoryMock.count.mockResolvedValue(users.length);
    });

    it('should return a list of 2 users', async () => {
      mapperMock.toUserResponseList.mockReturnValue(userResponses);

      const result = await service.findAll({
        page: 1,
        limit: 10,
      });

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('metadata');
      expect(result.data).toEqual(userResponses);
      expect(result.metadata.total).toBe(users.length);
    });

    it('should return 2 pages when limit is 1', async () => {
      const result = await service.findAll({
        page: 1,
        limit: 1,
      });

      expect(result.metadata.limit).toBe(1);
      expect(result.metadata.pages).toBe(2);
      expect(result.metadata.total).toBe(2);
    });
  });

  describe('create', () => {
    it('should create and return a user', async () => {
      const newUser: CreateUserDto = {
        firstname: 'Alice',
        lastname: 'Smith',
        email: 'alice@smith.com',
        password: 'jsjsjjso-mkkla',
      };

      const id = randomUUID();

      const userResponse: UserResponse = {
        id,
        firstname: 'Alice',
        lastname: 'Smith',
        email: 'alice@smith.com',
      };

      repositoryMock.save.mockResolvedValue({
        id,
        ...newUser,
      });
      repositoryMock.findOne.mockResolvedValue(null);
      mapperMock.toUserResponse.mockReturnValue({
        id,
        firstname: 'Alice',
        lastname: 'Smith',
        email: 'alice@smith.com',
      });

      const createdUser = await service.create(newUser);

      expect(createdUser).not.toHaveProperty('password');
      expect(createdUser).toEqual(userResponse);
    });

    it('should throw ConflictException: email already in use', async () => {
      const newUser: CreateUserDto = {
        firstname: 'Alice',
        lastname: 'Smith',
        email: 'alice@smith.com',
        password: 'jsjsjjso-mkkla',
      };

      repositoryMock.findOne.mockResolvedValue({
        id: randomUUID(),
        ...newUser,
      });

      await expect(service.create(newUser))
        .rejects.toThrow('User with this email already exists')
        .catch((error) => {
          expect(error).toBeInstanceOf(ConflictException);
        });
    });
  });
});
