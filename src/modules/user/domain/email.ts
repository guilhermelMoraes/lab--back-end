import { Result, ValueObject } from '../../shared/domain';
import { NonStandardEmailError } from './errors';

type EmailProperties = {
  email: string;
}

export default class Email extends ValueObject<EmailProperties> {
  private static readonly VALID_EMAIL: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(email: EmailProperties) {
    super(email);
  }

  public static validateEmail(email: string): Result<string> | Result<NonStandardEmailError> {
    if (!this.VALID_EMAIL.test(email)) {
      return Result.fail<NonStandardEmailError>(new NonStandardEmailError(email));
    }

    return Result.ok<string>(email);
  }

  public static create(email: string): Result<Email> | Result<NonStandardEmailError> {
    const isEmailValid = this.validateEmail(email);
    if (isEmailValid.isFailure) {
      return Result.fail<NonStandardEmailError>(isEmailValid.error as Error);
    }

    return Result.ok<Email>(new Email({ email }));
  }
}
