import bcrypt from 'bcrypt';

import Result from '../../shared/domain/result';
import ValueObject from '../../shared/domain/value-object';
import { PasswordLengthError, PasswordMatchConfirmationError } from './errors';

type Hash = {
  hash: string;
}

type PasswordCreationProps = {
  password: string;
  passwordConfirmation: string;
}

export default class Password extends ValueObject<Hash> {
  private static readonly MIN_PASSWORD_LENGTH: number = 8;
  private static readonly MAX_PASSWORD_LENGTH: number = 30;
  private static readonly SALT_ROUNDS: number = 10;

  private constructor(hash: Hash) {
    super(hash);
  }

  private static validatePassword(passwordCreationProps: PasswordCreationProps):
    Result<Error> | Result<Password> {
    const { password, passwordConfirmation } = passwordCreationProps;

    if (password !== passwordConfirmation) {
      return Result.fail<PasswordMatchConfirmationError>(
        new PasswordMatchConfirmationError(password, passwordConfirmation),
      );
    }

    if (password.length < this.MIN_PASSWORD_LENGTH || password.length > this.MAX_PASSWORD_LENGTH) {
      return Result.fail<PasswordLengthError>(
        new PasswordLengthError(password.length),
      );
    }

    return Result.ok<Password>();
  }

  private static trimProperties(properties: PasswordCreationProps): PasswordCreationProps {
    const { password, passwordConfirmation } = properties;
    return {
      password: password.trim(),
      passwordConfirmation: passwordConfirmation.trim(),
    };
  }

  private static async hashPassword(rawPassword: string) {
    try {
      const hash = await bcrypt.hash(rawPassword, this.SALT_ROUNDS);
      return Result.ok<string>(hash);
    } catch (error) {
      // TODO: implement logging strategy
      return Result.fail<Error>(error as Error);
    }
  }

  public static async create(passwordCreationProps: PasswordCreationProps):
    Promise<Result<Password> | Result<Error>> {
    const { password, passwordConfirmation } = this.trimProperties(passwordCreationProps);
    const isPasswordValid = this.validatePassword({ password, passwordConfirmation });
    if (isPasswordValid.isFailure) {
      return Result.fail<Error>(isPasswordValid.error as Error);
    }

    const hashOrError = await this.hashPassword(passwordCreationProps.password);
    if (hashOrError.isFailure) {
      return Result.fail<Error>(hashOrError.error as Error);
    }

    const { value: hash } = hashOrError as Result<string>;

    return Result.ok<Password>(new Password({ hash }));
  }
}
