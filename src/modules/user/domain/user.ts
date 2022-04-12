import Crypto from 'crypto';

import Email from './email';
import Password from './password';
import Username from './username';

export type UserProperties = {
  userId: string;
  email: string;
  username: string;
  hash: string;
}

// FIXME: this is an anemic model. It shouldn't.
export default class User {
  private readonly _userId: string;
  private readonly _email: Email;
  private readonly _username: Username;
  private readonly _hash: Password;

  constructor(email: Email, username: Username, password: Password) {
    this._userId = Crypto.randomUUID();
    this._email = email;
    this._username = username;
    this._hash = password;
  }

  public get userId(): string {
    return this._userId;
  }

  public get email(): string {
    return this._email.properties.email;
  }

  public get username(): string {
    return this._username.properties.username;
  }

  public get hash(): string {
    return this._hash.properties.hash;
  }
}
