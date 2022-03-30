/* eslint-disable import/prefer-default-export */
export class InvalidUsernameError extends Error {
  constructor(reason: string) {
    super(reason);
    this.name = 'InvalidUsernameError';
  }
}
