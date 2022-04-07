import Result from '../../shared/domain/result';
import ValueObject from '../../shared/domain/value-object';
import { NonStandardEmailError } from './errors';

type EmailProperties = {
  email: string;
}

export default class Email extends ValueObject<EmailProperties> {
  private static readonly VALID_EMAIL: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(email: EmailProperties) {
    super(email);
  }

  private static validateEmail(email: string): Result<Email> {
    if (!this.VALID_EMAIL.test(email)) {
      return Result.fail<Email>(`The invalid e-mail was ${email}`);
    }

    return Result.ok<Email>();
  }

  public static create(email: string): Result<Email> | Result<NonStandardEmailError> {
    const isEmailValid = this.validateEmail(email);
    if (isEmailValid.isFailure) {
      return Result.fail<NonStandardEmailError>(new NonStandardEmailError(email));
    }

    return Result.ok<Email>(new Email({ email }));
  }
}
