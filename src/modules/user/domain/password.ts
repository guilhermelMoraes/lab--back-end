/* eslint-disable no-use-before-define */
import bcrypt from 'bcrypt';

import { Either, left, right } from '../../shared/either';
import Result from '../../shared/result';
import ValueObject from '../../shared/value-object';
import InvalidPasswordError from './errors/invalid-password';

type PasswordProperties = {
  hash: string;
};

type CreatePassword = {
  password: string;
  passwordConfirmation: string;
};

type ValidationResponse = {
  succeeded: boolean;
  message?: string;
}

type HashResponse = Promise<Either<InvalidPasswordError, string>>;

type Response = Promise<Either<Result<InvalidPasswordError>, Result<Password>>>;

export default class Password extends ValueObject<PasswordProperties> {
  private static readonly MIN_LENGTH: number = 8;
  private static readonly MAX_LENGTH: number = 30;
  private static readonly SALT_ROUNDS: number = 12;

  private constructor(properties: PasswordProperties) {
    super(properties);
  }

  public get hash(): string {
    return this.properties.hash;
  }

  private static validatePassword(passwordProps: CreatePassword): ValidationResponse {
    const { password, passwordConfirmation } = passwordProps;
    if (password !== passwordConfirmation) {
      return {
        succeeded: false,
        message: 'Password doesn\'t match confirmation',
      };
    }

    if (password.length < this.MIN_LENGTH || password.length > this.MAX_LENGTH) {
      return {
        succeeded: false,
        message: 'Password length must be higher than 8 characters and smaller than 30 characters',
      };
    }
    return {
      succeeded: true,
    };
  }

  private static async hashPassword(password: string): HashResponse {
    try {
      const hash = await bcrypt.hash(password, this.SALT_ROUNDS);
      return right(hash);
    } catch (error: any) {
      return left(error);
    }
  }

  public static async create(passwordProps: CreatePassword): Response {
    const passwordValidation = this.validatePassword(passwordProps);
    if (!passwordValidation.succeeded) {
      return left(Result.fail<InvalidPasswordError>(
        new InvalidPasswordError(passwordValidation.message as string).message,
      ));
    }

    const hashOrError = await this.hashPassword(passwordProps.password);
    if (hashOrError.isRight()) {
      const hash = hashOrError.value;
      return right(Result.ok<Password>(new Password({ hash })));
    }

    return left(Result.fail<InvalidPasswordError>(new InvalidPasswordError('asda').message));
  }
}
