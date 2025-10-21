import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UserResponse } from './dtos/user-response';

@Injectable()
export class UsersMapper {
  toUserResponse(user: User): UserResponse {
    const userResponse = new UserResponse();
    userResponse.id = user.id;
    userResponse.firstname = user.firstname;
    userResponse.lastname = user.lastname;
    userResponse.email = user.email;
    userResponse.bio = user.bio;

    return userResponse;
  }

  toUserResponseList(users: User[]): UserResponse[] {
    return users.map((user) => this.toUserResponse(user));
  }
}
