import { UserProperties } from '@user/Domain';

interface UserRepository<UserModel> {
  findUserByEmail(email: string): Promise<UserModel | null>;
  create(userProperties: UserProperties): Promise<UserModel>;
}

export default UserRepository;
