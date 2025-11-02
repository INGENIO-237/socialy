import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/auth/auth.service';
import { UserResponse } from 'src/users/dtos/user-response';
import { LocalStrategy } from './local-strategy';

describe('LocalStrategy', () => {
  let provider: LocalStrategy;

  const authServiceMock = {
    validateUser: jest.fn(),
  };

  const user: UserResponse = {
    id: 'some-uuid',
    firstname: 'John',
    lastname: 'Doe',
    email: 'john.doe@example.com',
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    provider = moduleRef.get(LocalStrategy);
  });

  describe('validate authentication', () => {
    it('should log in user when provided the right credentials', async () => {
      authServiceMock.validateUser.mockResolvedValue(user);

      const result = await provider.validate(
        user.email,
        'some-invented-password',
      );

      expect(result).toEqual(user);
    });

    it('should throw BadRquestException when invalid credentials', async () => {
      authServiceMock.validateUser.mockResolvedValue(null);

      await expect(provider.validate(user.email, 'some-dummy-password'))
        .rejects.toThrow('Invalid credentials')
        .catch((error) => {
          expect(error).toBeInstanceOf(BadRequestException);
        });
    });
  });
});
