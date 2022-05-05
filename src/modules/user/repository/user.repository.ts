import { Result } from '@shared/domain';
import { UserProperties } from '@user/domain';

interface UserRepository {
  create(user: UserProperties): Promise<Result<boolean> | Result<Error>>;
  findUserByEmail(email: string): Promise<UserProperties | null>;
}

export default UserRepository;
