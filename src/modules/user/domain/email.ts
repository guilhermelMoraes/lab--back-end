import { TypeGuards } from '@shared/utils';
import { ValueObject } from '@shared/domain';
import { NonStandardEmailError } from './errors';

type EmailProperties = {
  email: string;
}

export default class Email extends ValueObject<EmailProperties> {
  private static readonly VALID_EMAIL: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(email: EmailProperties) {
    super(email);
  }

  public static validateEmail(email: unknown): string | Error {
    if (TypeGuards.isString(email)) {
      if (!this.VALID_EMAIL.test(email)) {
        return new NonStandardEmailError(email);
      }

      return email;
    }

    return new TypeError(`E-mail expect a string, but got ${typeof email}`);
  }

  public static create(email: unknown): Email | Error {
    const isEmailValid = this.validateEmail(email);
    if (TypeGuards.isError(isEmailValid)) {
      return isEmailValid;
    }

    return new Email({
      email: isEmailValid,
    });
  }
}
