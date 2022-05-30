import bcrypt from 'bcrypt';
import { logger } from '@shared/logger';
import { ValueObject } from '@shared/domain';
import { TypeGuards, ValidationResponse } from '@shared/utils';
import { LengthError, PasswordMatchConfirmationError } from './Errors';

type PasswordProps = {
  hash: string;
}

type PasswordCreationProps = {
  password: string;
  passwordConfirmation: string;
}

export default class Password extends ValueObject<PasswordProps> {
  private static readonly MIN_LENGTH = 8;
  private static readonly MAX_LENGTH = 60;
  private static readonly SALT_ROUNDS = 10;

  private constructor(passwordProps: PasswordProps) {
    super(passwordProps);
  }

  private static trimmedPasswordLength(password: string): number {
    return password.trim().length;
  }

  private static validate(props: PasswordCreationProps): ValidationResponse {
    for (const [name, value] of Object.entries(props)) {
      if (TypeGuards.isString(value)) {
        const passLength = this.trimmedPasswordLength(value);
        if (passLength < this.MIN_LENGTH || passLength > this.MAX_LENGTH) {
          return {
            succeed: false,
            error: new LengthError(name, passLength),
          };
        }
      } else {
        return {
          succeed: false,
          error: new TypeError(`${name} expects a string but got ${typeof value}`),
        };
      }
    }

    if (props.password !== props.passwordConfirmation) {
      return {
        succeed: false,
        error: new PasswordMatchConfirmationError(),
      };
    }

    return { succeed: true };
  }

  private static async hashPassword(rawPassword: string): Promise<string | Error> {
    try {
      return await bcrypt.hash(rawPassword, this.SALT_ROUNDS);
    } catch (error) {
      const bcryptError = error as Error;
      bcryptError.message = `Attempt to use ${rawPassword} as a password | ${bcryptError.message}`;
      logger.error(bcryptError);
      return bcryptError;
    }
  }

  public static async create(creationProps: PasswordCreationProps) {
    const passwordValidation = this.validate(creationProps);
    if (!passwordValidation.succeed) {
      return passwordValidation.error;
    }

    const hashOrError = await this.hashPassword(creationProps.password);
    if (TypeGuards.isError(hashOrError)) {
      return hashOrError;
    }

    return new Password({ hash: hashOrError });
  }
}
