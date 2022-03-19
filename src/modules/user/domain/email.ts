import Result from '../../shared/result';
import ValueObject from '../../shared/value-object';
import InvalidEmailError from './errors/invalid-email';

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
      return Result.fail<Email>('Please, provide an e-mail matching the following pattern: name@domain.com');
    }

    return Result.ok<Email>();
  }

  public static create(email: string) {
    const isEmailValid = this.validateEmail(email);
    if (isEmailValid.isFailure) {
      return Result.fail<Email>(new InvalidEmailError(isEmailValid.error as string).message);
    }

    return Result.ok<Email>(new Email({ email }));
  }
}
