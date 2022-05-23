import { ValueObject } from '@shared/domain';
import { Result, TypeGuards } from '@shared/utils';
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

  private static validateUsername(username: unknown):
    Result<Error> | Result<string> {
    if (TypeGuards.isString(username)) {
      const trimmedUsername: number = username.trim().length;

      if (trimmedUsername < this._MIN_LENGTH || trimmedUsername > this._MAX_LENGTH) {
        return Result.fail<UsernameLengthError>(
          new UsernameLengthError(this._MIN_LENGTH, this._MAX_LENGTH, trimmedUsername),
        );
      }

      return Result.ok<string>(username);
    }

    return Result.fail<TypeError>(new TypeError(`Username expects a string but got ${typeof username}`));
  }

  public static create(username: unknown): Result<UsernameLengthError> | Result<Username> {
    const usernameIsValid = this.validateUsername(username);

    if (usernameIsValid.isFailure) {
      return Result.fail<UsernameLengthError>(usernameIsValid.error as Error);
    }

    return Result.ok<Username>(new Username({
      username: usernameIsValid.value as string,
    }));
  }
}
