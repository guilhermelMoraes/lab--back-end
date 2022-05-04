import { DataSource, Repository } from 'typeorm';
import { UserProperties } from '@user/domain';
import UserModel from '@user/infrastructure/database/user.model';
import UserRepository from '../user.repository';

export default class UserTypeOrmRepository implements UserRepository {
  private readonly _typeOrmUserRepo: Repository<UserModel>;

  constructor(dataSource: DataSource) {
    this._typeOrmUserRepo = dataSource.getRepository(UserModel);
  }

  public async create(user: UserProperties): Promise<void> {
    const userInstance = new UserModel();
    userInstance.email = user.email;
    userInstance.hash = user.hash;
    userInstance.username = user.username;
    userInstance.userId = user.userId;
    await this._typeOrmUserRepo.save(userInstance);
  }

  public async findUserByEmail(email: string): Promise<UserProperties | null> {
    const user = await this._typeOrmUserRepo.findOneBy({
      email,
    });

    return user;
  }
}
