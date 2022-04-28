import { UserProperties } from '../domain';

interface UserRepository {
  create(user: UserProperties): Promise<void>;
  findUserByEmail(email: string): Promise<UserProperties | null>;
}

export default UserRepository;
