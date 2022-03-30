/* eslint-disable import/prefer-default-export */
export class UsernameLengthError extends Error {
  constructor(minLength: number, maxLength: number, actualLength: number) {
    super(
      `Username length must be in between ${minLength} and ${maxLength} characters. Got ${actualLength}`,
    );
    this.name = 'UsernameLengthError';
  }
}
