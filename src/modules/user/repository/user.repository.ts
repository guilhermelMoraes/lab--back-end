import { UserProperties } from '../domain/user';

interface UserRepository {
  create(user: UserProperties): Promise<void>;
  findUserByEmail(email: string): Promise<UserProperties | null>;
}

export default UserRepository;
