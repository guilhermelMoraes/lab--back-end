import { Result, TypeGuards, ValueObject } from '@shared/domain';
import { NonStandardEmailError } from './errors';

type EmailProperties = {
  email: string;
}

export default class Email extends ValueObject<EmailProperties> {
  private static readonly VALID_EMAIL: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(email: EmailProperties) {
    super(email);
  }

  public static validateEmail(email: string): Result<string> | Result<Error> {
    if (TypeGuards.isString(email)) {
      if (!this.VALID_EMAIL.test(email)) {
        return Result.fail<NonStandardEmailError>(new NonStandardEmailError(email));
      }

      return Result.ok<string>(email);
    }

    return Result.fail<TypeError>(new TypeError(`E-mail expect a string, but got ${typeof email}`));
  }

  public static create(email: any): Result<Email> | Result<Error> {
    const isEmailValid = this.validateEmail(email);
    if (isEmailValid.isFailure) {
      return Result.fail<Error>(isEmailValid.error as Error);
    }

    return Result.ok<Email>(new Email({ email }));
  }
}
