import Result from '../../shared/domain/result';
import ValueObject from '../../shared/domain/value-object';
import { InvalidUsernameError } from './errors/invalid-username';
import { UsernameLengthError } from './errors/username-length-error';

type UsernameProperty = {
  username: string;
}

export default class Username extends ValueObject<UsernameProperty> {
  private static readonly _MIN_LENGTH: number = 4;
  private static readonly _MAX_LENGTH: number = 100;

  private constructor(username: UsernameProperty) {
    super(username);
  }

  private static validateUsername(username: string):
    Result<InvalidUsernameError> | Result<Username> {
    const trimmedUsername: number = username.trim().length;

    if (trimmedUsername < this._MIN_LENGTH || trimmedUsername > this._MAX_LENGTH) {
      return Result.fail<UsernameLengthError>(
        new UsernameLengthError(this._MIN_LENGTH, this._MAX_LENGTH, trimmedUsername),
      );
    }

    return Result.ok<Username>();
  }

  public static create(username: string): Result<UsernameLengthError> | Result<Username> {
    const usernameIsValid = this.validateUsername(username);

    if (usernameIsValid.isFailure) {
      return Result.fail<UsernameLengthError>(usernameIsValid.error);
    }

    return Result.ok<Username>(new Username({ username }));
  }
}
