import { TypeGuards } from '@shared/utils';
import Crypto from 'crypto';
import Email from './email';
import Password from './password';
import Username from './username';

export interface UserProperties {
  userId: string;
  email: string;
  username: string;
  hash: string;
  isEmailVerified?: boolean;
}

// FIXME: this is an anemic model. It shouldn't.
export default class User implements UserProperties {
  private readonly _userId: string;
  private readonly _email: Email;
  private readonly _username: Username;
  private readonly _hash: Password;
  private _isEmailVerified = false;

  constructor(
    email: Email,
    username: Username,
    password: Password,
    userId?: string,
    isEmailVerified?: boolean,
  ) {
    this._userId = userId ?? Crypto.randomUUID();
    this._email = email;
    this._username = username;
    this._hash = password;

    if (TypeGuards.isBoolean(isEmailVerified)) {
      this._isEmailVerified = isEmailVerified;
    }
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

  public get isEmailVerified(): boolean {
    return this._isEmailVerified;
  }

  public generateVerificationToken(): string {
    return this.userId.slice(0, 8).toUpperCase();
  }
}
