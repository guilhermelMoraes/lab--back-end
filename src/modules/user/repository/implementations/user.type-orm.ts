import { DataSource, Repository } from 'typeorm';
import User from '../../infrastructure/database/user.model';
import UserRepository from '../user.repository';

export default class UserTypeOrmRepository implements UserRepository {
  private readonly _typeOrmRepo: Repository<User>;

  constructor(dataSource: DataSource) {
    this._typeOrmRepo = dataSource.getRepository(User);
  }

  // eslint-disable-next-line class-methods-use-this
  public async emailAlreadyUsed(email: string): Promise<boolean> {
    const userOrNull = await this._typeOrmRepo.findOneBy({ email });
    return !!userOrNull;
  }
}
