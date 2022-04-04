import { DataSource, Repository } from 'typeorm';
import { UserProperties } from '../../domain/user';
import UserModel from '../../infrastructure/database/user.model';
import UserRepository from '../user.repository';

export default class UserTypeOrmRepository implements UserRepository {
  private readonly _typeOrmUserRepo: Repository<UserModel>;

  constructor(dataSource: DataSource) {
    this._typeOrmUserRepo = dataSource.getRepository(UserModel);
  }

  public async create(user: UserProperties): Promise<void> {
    await this._typeOrmUserRepo.save(user);
  }

  public async emailAlreadyUsed(email: string): Promise<boolean> {
    const userOrNull = await this._typeOrmUserRepo.findOneBy({ email });
    return !!userOrNull;
  }
}
