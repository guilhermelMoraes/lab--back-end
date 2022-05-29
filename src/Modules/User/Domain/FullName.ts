import { ValueObject } from '@shared/domain';
import { TypeGuards, ValidationResponse } from '@shared/utils';
import { FullNameLengthError } from './Errors';

type FullNameProps = {
  firstName: string;
  surname: string;
}

export default class FullName extends ValueObject<FullNameProps> {
  private static readonly MIN_FULL_NAME_LENGTH = 4;
  private static readonly MAX_FULL_NAME_LENGTH = 45;

  private constructor(fullNameProps: FullNameProps) {
    super(fullNameProps);
  }

  private static trimmedNameLength(name: string): number {
    return name.trim().length;
  }

  private static validate(fnProps: FullNameProps): ValidationResponse {
    for (const [name, value] of Object.entries(fnProps)) {
      if (TypeGuards.isString(value)) {
        const nameLength = this.trimmedNameLength(value);
        if (nameLength < this.MIN_FULL_NAME_LENGTH || nameLength > this.MAX_FULL_NAME_LENGTH) {
          return {
            succeed: false,
            error: new FullNameLengthError(name, nameLength),
          };
        }
      } else {
        return {
          succeed: false,
          error: new TypeError(`${name} expects a string but got ${typeof value}`),
        };
      }
    }

    return { succeed: true };
  }

  public static create(fullNameProps: FullNameProps): FullName | Error {
    const fullNameValidation = this.validate(fullNameProps);
    if (fullNameValidation.succeed) {
      return new FullName({
        firstName: fullNameProps.firstName,
        surname: fullNameProps.surname,
      });
    }

    return fullNameValidation.error as Error;
  }
}
