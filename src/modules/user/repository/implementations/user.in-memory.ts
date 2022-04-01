import User from '../../domain/user';
import UserRepository from '../user.repository';

/**
 * @description This repository is for testing purposes only. DO NOT use it for production. Never.
 */
export default class UserInMemoryRepository implements UserRepository {
  private _users: User[] = [];

  public async emailAlreadyUsed(email: string): Promise<boolean> {
    return Promise.resolve(this._users.some((user) => user.email === email));
  }

  public async create(user: User): Promise<void> {
    this._users.push(user);
  }
}
