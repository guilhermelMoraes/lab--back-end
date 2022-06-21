export default class PasswordMatchConfirmationError extends Error {
  constructor() {
    super('Password and confirmation are different');
    this.name = 'PasswordMatchConfirmationError';
  }
}
