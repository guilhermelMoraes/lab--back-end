import { User, UserProperties } from './domain';

export default class UserMapper {
  public static toDatabase(user: User): UserProperties {
    const {
      userId,
      email,
      username,
      hash,
    } = user;

    return {
      userId,
      email,
      username,
      hash,
    };
  }
}
