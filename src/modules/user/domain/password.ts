import { ValueObject } from '@shared/domain';
import { logger } from '@shared/logger';
import { Result, TypeGuards } from '@shared/utils';
import bcrypt from 'bcrypt';
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

  constructor(hash: Hash) {
    super(hash);
  }

  private static validatePassword(passwordCreationProps: PasswordCreationProps):
    Result<Error> | Result<Password> {
    if (
      TypeGuards.isString(passwordCreationProps.password)
      && TypeGuards.isString(passwordCreationProps.passwordConfirmation)
    ) {
      const { password, passwordConfirmation } = this.trimProperties(passwordCreationProps);
      if (password !== passwordConfirmation) {
        return Result.fail<PasswordMatchConfirmationError>(
          new PasswordMatchConfirmationError(password, passwordConfirmation),
        );
      }

      if (
        password.length < this.MIN_PASSWORD_LENGTH
        || password.length > this.MAX_PASSWORD_LENGTH
      ) {
        return Result.fail<PasswordLengthError>(
          new PasswordLengthError(password.length),
        );
      }

      return Result.ok<Password>();
    }

    return Result.fail<TypeError>(new TypeError('Expect to receive a string for password and confirmation'));
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
    } catch (bcryptError) {
      const error = (bcryptError as Error);
      const errorMessage = `${error.message} | Attempt to use ${rawPassword} as a password`;
      error.message = errorMessage;
      logger.error(error);
      return Result.fail<Error>(error);
    }
  }

  public static async compare(rawPassword: unknown, hashedPassword: string):
    Promise<Result<boolean> | Result<Error>> {
    try {
      if (TypeGuards.isString(rawPassword)) {
        const passwordMatch: boolean = await bcrypt.compare(rawPassword, hashedPassword);
        return Result.ok<boolean>(passwordMatch);
      }

      return Result.fail<TypeError>(new TypeError(`Expect a string for password but got ${typeof rawPassword}`));
    } catch (bcryptError) {
      logger.error(bcryptError as Error);
      return Result.fail<Error>(bcryptError as Error);
    }
  }

  public static async create(passwordCreationProps: PasswordCreationProps):
    Promise<Result<Password> | Result<Error>> {
    const { password, passwordConfirmation } = passwordCreationProps;

    const isPasswordValid = this.validatePassword({
      password,
      passwordConfirmation,
    });

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
