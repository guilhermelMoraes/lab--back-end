import { UserProperties } from '../../domain';
import UserRepository from '../user.repository';

/**
 * @description This repository is for testing purposes only. DO NOT use it for production. Never.
 */
export default class UserInMemoryRepository implements UserRepository {
  private _users: UserProperties[] = [];

  public async create(user: UserProperties): Promise<void> {
    this._users.push(user);
  }

  public async findUserByEmail(email: string): Promise<UserProperties | null> {
    const predicate = ({ email: userEmail }: UserProperties): boolean => userEmail === email;
    const user = this._users.filter(predicate)[0];
    return user === undefined ? null : user;
  }
}
