import { Either, left, right } from '../../shared/either';
import Result from '../../shared/result';
import ValueObject from '../../shared/value-object';
import InvalidEmailError from './errors/invalid-email';

type EmailProps = {
  email: string;
};

type ValidationResponse = {
  succeeded: boolean;
  message?: string;
}

export default class Email extends ValueObject<EmailProps> {
  private static readonly EMAIL_VALIDATION: RegExp = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;

  private constructor(properties: EmailProps) {
    super(properties);
  }

  private static validateEmail(email: string): ValidationResponse {
    if (!this.EMAIL_VALIDATION.test(email)) {
      return {
        succeeded: false,
        message: 'Invalid e-mail',
      };
    }

    return {
      succeeded: true,
    };
  }

  public static create(email: string): Either<Result<InvalidEmailError>, Result<Email>> {
    const emailValidation = this.validateEmail(email);
    if (emailValidation.succeeded) {
      return right(Result.ok<Email>(new Email({ email })));
    }
    return left(Result.fail<InvalidEmailError>(new InvalidEmailError(email).message));
  }
}
