import { ValueObject } from '@shared/domain';
import { TypeGuards, ValidationResponse } from '@shared/utils';
import { InvalidEmailError } from './Errors';

type EmailProps = {
  email: string;
}

export default class Email extends ValueObject<EmailProps> {
  private constructor(emailProps: EmailProps) {
    super(emailProps);
  }

  private static readonly VALID_EMAIL: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private static validate(email: unknown): ValidationResponse {
    if (TypeGuards.isString(email)) {
      if (this.VALID_EMAIL.test(email)) {
        return {
          succeed: true,
        };
      }

      return {
        succeed: false,
        error: new InvalidEmailError(email),
      };
    }

    return {
      succeed: false,
      error: new TypeError(`E-mail expects a string but got ${typeof email}`),
    };
  }

  public static create(email: string): Email | Error {
    const emailValidation = this.validate(email);
    if (emailValidation.succeed) {
      return new Email({ email });
    }

    return emailValidation.error as Error;
  }
}
