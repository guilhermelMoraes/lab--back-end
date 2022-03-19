import bcrypt from 'bcrypt';

import Result from '../../shared/result';
import ValueObject from '../../shared/value-object';
import InvalidPasswordError from './errors/invalid-password';

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

  private static validatePassword(passwordCreationProps: PasswordCreationProps) {
    const { password, passwordConfirmation } = passwordCreationProps;

    if (password !== passwordConfirmation) {
      return Result.fail<Password>('Password and confirmation does\'t match');
    }

    if (password.length < this.MIN_PASSWORD_LENGTH || password.length > this.MAX_PASSWORD_LENGTH) {
      return Result.fail<Password>('Password must have at least eight characters and max thirty characters');
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
      return Result.fail<string>('Error while hashing the password');
    }
  }

  public static async create(passwordCreationProps: PasswordCreationProps) {
    const { password, passwordConfirmation } = this.trimProperties(passwordCreationProps);
    const isPasswordValid = this.validatePassword({ password, passwordConfirmation });
    if (isPasswordValid.isFailure) {
      return Result
        .fail<Password>(
          new InvalidPasswordError(isPasswordValid.error as string).message,
        );
    }

    const hashOrError = await this.hashPassword(passwordCreationProps.password);
    if (hashOrError.isFailure) {
      return Result.fail<Password>(
        new InvalidPasswordError(hashOrError.error as string).message,
      );
    }

    const { value: hash } = hashOrError;

    return Result.ok<Password>(new Password({ hash }));
  }
}
