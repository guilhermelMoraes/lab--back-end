import { UserProperties } from '@user/domain';
import UserModel from '@user/infrastructure/database/user.model';
import { DataSource, Repository } from 'typeorm';
import UserRepository from '../user.repository';

export default class UserTypeOrmRepository implements UserRepository {
  private readonly _typeOrmUserRepo: Repository<UserModel>;

  constructor(dataSource: DataSource) {
    this._typeOrmUserRepo = dataSource.getRepository(UserModel);
  }

  public async create(user: UserProperties): Promise<void> {
    const {
      email, hash,
      userId, username,
      isEmailVerified,
    } = user;

    const userInstance = this._typeOrmUserRepo.create({
      email, hash, userId, username, isEmailVerified,
    });
    await this._typeOrmUserRepo.save(userInstance);
  }

  public async findUserByEmail(email: string): Promise<UserProperties | null> {
    const user = await this._typeOrmUserRepo.findOneBy({
      email,
    });

    return user;
  }
}
