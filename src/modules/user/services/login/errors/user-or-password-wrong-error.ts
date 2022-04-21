/* eslint-disable import/prefer-default-export */
export class UserOrPasswordWrongError extends Error {
  constructor() {
    super('User or password wrong');
    this.name = 'UserOrPasswordWrongError';
  }
}
