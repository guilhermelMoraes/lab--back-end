/* eslint-disable no-shadow */
import { randomUUID } from 'crypto';
import Email from './Email';
import FullName from './FullName';
import Password from './Password';

export interface FullNameProperties {
  firstName: string;
  surname: string;
}

export interface UserProperties {
  userId: string;
  email: string;
  fullName: FullNameProperties;
  hash: string;
}

type DomainUserProperties = {
  userId?: string;
  email: Email;
  hash: Password;
  fullName: FullName;
};

export default class User implements UserProperties {
  private readonly _userId: string;
  private readonly _email: Email;
  private readonly _hash: Password;
  private readonly _fullName: FullName;

  constructor({
    email,
    fullName,
    hash,
    userId,
  }: DomainUserProperties) {
    this._email = email;
    this._fullName = fullName;
    this._hash = hash;
    this._userId = userId ?? randomUUID();
  }

  public get userId(): string {
    return this._userId;
  }

  public get email(): string {
    return this._email.properties.email;
  }

  public get fullName(): FullNameProperties {
    return this._fullName.properties;
  }

  public get hash(): string {
    return this._hash.properties.hash;
  }
}
