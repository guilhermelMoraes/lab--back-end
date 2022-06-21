import { UserProperties } from '@user/Domain';
import { FullNameModel, UserModel } from '@user/Infrastructure/Database';
import { DataSource, EntityManager } from 'typeorm';
import UserRepository from '../UserRepository';

export default class UserTypeOrmRepository implements UserRepository<UserModel> {
  private readonly _entityManager: EntityManager;

  constructor(dataSource: DataSource) {
    this._entityManager = dataSource.manager;
  }

  public async findUserByEmail(email: string): Promise<UserModel | null> {
    return this._entityManager.findOneBy(UserModel, { email });
  }

  public async create(userProperties: UserProperties): Promise<UserModel> {
    const {
      email, fullName, hash, userId,
    } = userProperties;
    const { firstName, surname } = fullName;

    const fullNameInstance = this._entityManager.create(FullNameModel, {
      firstName, surname,
    });

    const fn = await this._entityManager.save(fullNameInstance);

    const userInstance = this._entityManager.create(UserModel, {
      email, fullNameFk: fn, userId, hash,
    });

    return this._entityManager.save(userInstance);
  }
}
