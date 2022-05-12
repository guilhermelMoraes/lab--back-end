import {
  Email, Password, User,
  Username, UserProperties,
} from './domain';

export default class UserMapper {
  public static toDatabase(user: User): UserProperties {
    const {
      userId,
      email,
      username,
      hash,
      isEmailVerified,
    } = user;

    return {
      userId,
      email,
      username,
      hash,
      isEmailVerified,
    };
  }

  public static toDomain(user: UserProperties): User {
    const { userId, isEmailVerified, hash } = user;
    const email = Email.create(user.email).value as Email;
    const username = Username.create(user.username).value as Username;
    const password = new Password({ hash });

    return new User(email, username, password, userId, isEmailVerified);
  }
}
