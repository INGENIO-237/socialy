import { Test, TestingModule } from '@nestjs/testing';
import { UsersMapper } from 'src/users/users-mapper';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  const usersServiceMock = {
    findByEmail: jest.fn(),
  };

  const usersMapperMock = {
    toUserResponse: jest.fn(),
  };

  const userMock = {
    id: 'some-uuid',
    firstname: 'John',
    lastname: 'Doe',
    email: 'some@email.com',
    validatePassword: jest.fn(),
  };

  const { validatePassword, ...user } = userMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
        {
          provide: UsersMapper,
          useValue: usersMapperMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    usersMapperMock.toUserResponse.mockReturnValue(user);
  });

  describe('validateUser', () => {
    it('should validate user for existing user', async () => {
      usersServiceMock.findByEmail.mockResolvedValue(userMock);
      userMock.validatePassword.mockResolvedValue(true);

      const result = await service.validateUser(userMock.email, 'some-pwd-123');

      expect(result).toBe(user);
    });

    it('should return null when given incorrect password', async () => {
      usersServiceMock.findByEmail.mockResolvedValue(userMock);
      userMock.validatePassword.mockResolvedValue(false);

      const result = await service.validateUser(
        userMock.email,
        'incorrect-password',
      );

      expect(result).toBe(null);
    });
  });
});
