import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt-strategy.ts';
import { JwtPayload } from 'src/auth/types/jwt-payload.js';

jest.mock('src/configs/jwt.config', () => ({
  jwtOptions: {
    secret: 'test-secret',
  },
}));

describe('JwtStrategy', () => {
  let provider: JwtStrategy;

  const payload: JwtPayload = {
    sub: 'kajkjdauuudiuia',
    email: 'some@email.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    provider = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should validate payload', () => {
    const user = provider.validate(payload);

    expect(user).toBeDefined();
    expect(user.email).toEqual(payload.email);
    expect(user.userId).toEqual(payload.sub);
  });
});
