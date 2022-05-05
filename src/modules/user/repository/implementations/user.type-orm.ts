import { Result } from '@shared/domain';
import { UserProperties } from '@user/domain';
import UserModel from '@user/infrastructure/database/user.model';
import { DataSource, Repository } from 'typeorm';
import UserRepository from '../user.repository';

export default class UserTypeOrmRepository implements UserRepository {
  private readonly _typeOrmUserRepo: Repository<UserModel>;

  constructor(dataSource: DataSource) {
    this._typeOrmUserRepo = dataSource.getRepository(UserModel);
  }

  public async create(user: UserProperties): Promise<Result<boolean> | Result<Error>> {
    try {
      const {
        email, hash,
        userId, username,
      } = user;

      const userInstance = this._typeOrmUserRepo.create({
        email, hash, userId, username,
      });
      await this._typeOrmUserRepo.save(userInstance);
      return Result.ok<boolean>(true);
    } catch (error) {
      // TODO: implement logging strategy
      return Result.fail<Error>(error as Error);
    }
  }

  public async findUserByEmail(email: string): Promise<UserProperties | null> {
    const user = await this._typeOrmUserRepo.findOneBy({
      email,
    });

    return user;
  }
}
