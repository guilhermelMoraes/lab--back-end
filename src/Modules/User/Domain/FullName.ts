import { ValueObject } from 'src/Shared/Domain';
import { ValidationResponse } from 'src/Shared/Utils';
import { LengthError } from './Errors';

type FullNameProps = {
  firstName: string;
  surname: string;
}

export default class FullName extends ValueObject<FullNameProps> {
  private static readonly MIN_LENGTH = 4;
  private static readonly MAX_LENGTH = 45;
  private static readonly FULL_NAME_KEYS: Array<keyof FullNameProps> = ['firstName', 'surname'];

  private constructor(fullNameProps: FullNameProps) {
    super(fullNameProps);
  }

  private static trimmedNameLength(name: string): number {
    return name.trim().length;
  }

  private static isFullNameProps(property: any): property is FullNameProps {
    if (property !== null && typeof property === 'object') {
      return this.FULL_NAME_KEYS
        .every(
          (key: string): boolean => (key in property) && (typeof property[key] === 'string'),
        );
    }

    return false;
  }

  private static validate(props: unknown): ValidationResponse {
    if (this.isFullNameProps(props)) {
      for (const value of this.FULL_NAME_KEYS) {
        const nameLength = this.trimmedNameLength(props[value]);
        if (nameLength < this.MIN_LENGTH || nameLength > this.MAX_LENGTH) {
          return {
            succeed: false,
            error: new LengthError(value, nameLength),
          };
        }
      }

      return {
        succeed: true,
      };
    }

    return {
      error: new TypeError('fullName expects an object with firstName and surname as strings'),
      succeed: false,
    };
  }

  public static create(fullNameProps: FullNameProps): FullName | Error {
    const fullNameValidation = this.validate(fullNameProps);
    if (fullNameValidation.succeed) {
      return new FullName({
        firstName: fullNameProps.firstName,
        surname: fullNameProps.surname,
      });
    }

    return fullNameValidation.error;
  }
}
