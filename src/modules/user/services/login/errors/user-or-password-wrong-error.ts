export default class UserOrPasswordWrongError extends Error {
  constructor() {
    super('User or password wrong');
    this.name = 'UserOrPasswordWrongError';
  }
}
