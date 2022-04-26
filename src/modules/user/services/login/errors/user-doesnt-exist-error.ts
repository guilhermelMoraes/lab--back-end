// eslint-disable-next-line import/prefer-default-export
export class UserDoesntExistError extends Error {
  constructor(email: string) {
    super(`${email} is not associated to any users`);
    this.name = 'UserDoesntExistError';
  }
}
