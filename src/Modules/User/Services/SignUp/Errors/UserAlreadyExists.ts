export default class UserAlreadyExistsError extends Error {
  constructor() {
    super('There\'s already a user attached to that e-mail');
    this.name = 'UserAlreadyExistsError';
  }
}
