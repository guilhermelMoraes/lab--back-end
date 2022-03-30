import Result from '../../shared/domain/result';
import ValueObject from '../../shared/domain/value-object';
import { InvalidUsernameError } from './errors';

type UsernameProperty = {
  username: string;
}

export default class Username extends ValueObject<UsernameProperty> {
  private constructor(username: UsernameProperty) {
    super(username);
  }

  private static validateUsername(username: string): Result<Username> {
    if (username.trim().length === 0) {
      return Result.fail<Username>('Username cannot be empty');
    }

    if (username.trim().length >= 100) {
      return Result.fail<Username>('Username cannot be bigger than 100 characters');
    }
    return Result.ok<Username>();
  }

  public static create(username: string): Result<Username> {
    const isUsernameValid = this.validateUsername(username);
    if (isUsernameValid.isFailure) {
      return Result.fail<Username>(
        new InvalidUsernameError(isUsernameValid.error as string).message,
      );
    }

    return Result.ok<Username>(new Username({ username }));
  }
}
