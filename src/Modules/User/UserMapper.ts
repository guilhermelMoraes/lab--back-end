import { User, UserProperties } from './Domain';

const UserMapper = {
  getProperties(user: User): UserProperties {
    const {
      email,
      fullName,
      hash,
      userId,
    } = user;

    return {
      email, fullName, hash, userId,
    };
  },
};

export default UserMapper;
