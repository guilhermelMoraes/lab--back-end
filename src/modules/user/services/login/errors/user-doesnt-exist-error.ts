/* eslint-disable import/prefer-default-export */
export class UserDoesntExistError extends Error {
  constructor(userEmail: string) {
    super(`There are no users associated with ${userEmail}`);
    this.name = 'UserDoesntExistError';
  }
}
