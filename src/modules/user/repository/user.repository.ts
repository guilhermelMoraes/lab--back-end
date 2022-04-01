import User from '../domain/user';

interface UserRepository {
  emailAlreadyUsed(email: string): Promise<boolean>;
  create(user: User): Promise<void>;
}

export default UserRepository;
