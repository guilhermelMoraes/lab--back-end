import Result from '../../shared/domain/result';
import ValueObject from '../../shared/domain/value-object';
import NonStandardEmailError from './errors/non-standard-email-error';

type EmailProperties = {
  email: string;
}

export default class Email extends ValueObject<EmailProperties> {
  private static readonly VALID_EMAIL: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(email: EmailProperties) {
    super(email);
  }

  private static validateEmail(email: string) {
    if (!this.VALID_EMAIL.test(email)) {
      return Result.fail<Email>('E-mail does\'t match the following pattern: name@domain.com');
    }

    return Result.ok<Email>();
  }

  public static create(email: string): Result<Email> {
    const isEmailValid = this.validateEmail(email);
    if (isEmailValid.isFailure) {
      return Result.fail<Email>(new NonStandardEmailError(email));
    }

    return Result.ok<Email>(new Email({ email }));
  }
}
