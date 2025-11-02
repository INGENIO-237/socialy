import { Injectable } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { UserFollowResponse } from './dtos/user-follow.dto';

@Injectable()
export class FollowMapper {
  toUserFollowResponse(user: User): UserFollowResponse {
    const response = new UserFollowResponse();
    response.id = user.id;
    response.firstname = user.firstname;
    response.lastname = user.lastname;
    response.email = user.email;
    response.bio = user.bio;
    return response;
  }

  toUserFollowResponseList(users: User[]): UserFollowResponse[] {
    return users.map(user => this.toUserFollowResponse(user));
  }
}