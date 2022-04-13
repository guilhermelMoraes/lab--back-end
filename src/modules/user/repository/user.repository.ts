import { UserProperties } from '../domain/user';

interface UserRepository {
  emailAlreadyUsed(email: string): Promise<boolean>;
  create(user: UserProperties): Promise<void>;
  findUserByEmail(email: string): Promise<UserProperties | null>;
}

export default UserRepository;
