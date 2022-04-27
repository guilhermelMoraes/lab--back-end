export default class UserDoesntExistError extends Error {
  constructor(email: string) {
    super(`${email} is not associated to any users`);
    this.name = 'UserDoesntExistError';
  }
}
