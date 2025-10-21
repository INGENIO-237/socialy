import { Test, TestingModule } from '@nestjs/testing';
import { UserResponse } from './dtos/user-response';
import { User } from './user.entity';
import { UsersMapper } from './users-mapper';

describe('UsersMapper', () => {
  let mapper: UsersMapper;

  const users: User[] = [
    {
      id: 'some-random-uuid',
      firstname: 'John',
      lastname: 'Doe',
      password: 'some-dummy-password',
      email: 'john@doe.com',
    },
    {
      id: 'some-random-uuid-2',
      firstname: 'Jane',
      lastname: 'Doe',
      password: 'some-dummy-password',
      email: 'jane@doe.com',
    },
  ];

  const userResponses: UserResponse[] = [
    {
      id: 'some-random-uuid',
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@doe.com',
    },
    {
      id: 'some-random-uuid-2',
      firstname: 'Jane',
      lastname: 'Doe',
      email: 'jane@doe.com',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersMapper],
    }).compile();

    mapper = module.get<UsersMapper>(UsersMapper);
  });

  describe('toUserResponse', () => {
    it('should map User to UserResponse', () => {
      const result = mapper.toUserResponse(users[0]);

      expect(result).toEqual(userResponses[0]);
    });
  });

  describe('toUserResponseList', () => {
    it('should map User[] to UserResponse[]', () => {
      const result = mapper.toUserResponseList(users);

      expect(result.length).toEqual(userResponses.length);
      expect(result).toEqual(userResponses);
    });
  });
});
