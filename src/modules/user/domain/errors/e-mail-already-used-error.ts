/* eslint-disable import/prefer-default-export */
export class EmailAlreadyUsedError extends Error {
  constructor(email: string) {
    super(`${email} already used`);
    this.name = 'EmailAlreadyUsedError';
  }
}
