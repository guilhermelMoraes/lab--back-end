import { ValueObject } from '@shared/domain';
import { logger } from '@shared/logger';
import { TypeGuards } from '@shared/utils';
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

  private static validatePassword(props: PasswordCreationProps): true | Error {
    if (TypeGuards.isString([props.password, props.passwordConfirmation])) {
      const { password, passwordConfirmation } = this.trimProperties(props);
      if (password !== passwordConfirmation) {
        return new PasswordMatchConfirmationError();
      }

      if (
        password.length < this.MIN_PASSWORD_LENGTH || password.length > this.MAX_PASSWORD_LENGTH
      ) {
        return new PasswordLengthError(password.length);
      }

      return true;
    }

    return new TypeError('Expect to receive a string for password and confirmation');
  }

  private static trimProperties(props: PasswordCreationProps): PasswordCreationProps {
    const { password, passwordConfirmation } = props;
    return {
      password: password.trim(),
      passwordConfirmation: passwordConfirmation.trim(),
    };
  }

  private static async hashPassword(rawPassword: string): Promise<string | Error> {
    try {
      return await bcrypt.hash(rawPassword, this.SALT_ROUNDS);
    } catch (bcryptError) {
      const error = (bcryptError as Error);
      const errorMessage = `${error.message} | Attempt to use ${rawPassword} as a password`;
      error.message = errorMessage;
      logger.error(error);
      return error;
    }
  }

  public static async compare(rawPassword: unknown, hashedPassword: string):
    Promise<boolean | Error> {
    try {
      if (TypeGuards.isString(rawPassword)) {
        const passwordMatch: boolean = await bcrypt.compare(rawPassword, hashedPassword);
        return passwordMatch;
      }

      return new TypeError(`Expect a string for password but got ${typeof rawPassword}`);
    } catch (bcryptError) {
      logger.error(bcryptError as Error);
      return bcryptError as Error;
    }
  }

  public static async create(props: PasswordCreationProps) {
    const { password, passwordConfirmation } = props;

    const isPasswordValid = this.validatePassword({
      password,
      passwordConfirmation,
    });

    if (TypeGuards.isError(isPasswordValid)) {
      return isPasswordValid;
    }

    const hashOrError = await this.hashPassword(props.password);
    if (TypeGuards.isError(hashOrError)) {
      return hashOrError;
    }

    return new Password({ hash: hashOrError });
  }
}
