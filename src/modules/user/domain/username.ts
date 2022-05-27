import { ValueObject } from '@shared/domain';
import { TypeGuards } from '@shared/utils';
import { UsernameLengthError } from './errors';

type UsernameProperty = {
  username: string;
}

export default class Username extends ValueObject<UsernameProperty> {
  private static readonly _MIN_LENGTH: number = 4;
  private static readonly _MAX_LENGTH: number = 100;

  private constructor(username: UsernameProperty) {
    super(username);
  }

  private static validateUsername(username: unknown): Error | string {
    if (TypeGuards.isString(username)) {
      const trimmedUsername: number = username.trim().length;

      if (trimmedUsername < this._MIN_LENGTH || trimmedUsername > this._MAX_LENGTH) {
        return new UsernameLengthError(this._MIN_LENGTH, this._MAX_LENGTH, trimmedUsername);
      }

      return username;
    }

    return new TypeError(`Username expects a string but got ${typeof username}`);
  }

  public static create(username: unknown): UsernameLengthError | Username {
    const usernameIsValid = this.validateUsername(username);

    if (TypeGuards.isError(usernameIsValid)) {
      return usernameIsValid;
    }

    return new Username({
      username: usernameIsValid,
    });
  }
}
