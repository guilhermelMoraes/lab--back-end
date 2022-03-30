/* eslint-disable import/prefer-default-export */
export class PasswordLengthError extends Error {
  constructor(actualLength: number) {
    super(`Password must have at least 8 and max 30 characters. Got ${actualLength}`);
    this.name = 'PasswordLengthError';
  }
}
