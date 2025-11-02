import { UserResponse } from 'src/users/dtos/user-response';

export type JwtPayload = {
  sub: string;
} & Omit<UserResponse, 'id'>;
