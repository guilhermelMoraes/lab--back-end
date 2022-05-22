export default class PasswordMatchConfirmationError extends Error {
  constructor() {
    super('Password and confirmation don\'t match');
    this.name = 'PasswordMatchConfirmationError';
  }
}
