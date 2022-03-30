export default class PasswordMatchConfirmationError extends Error {
  constructor(password: string, confirmation: string) {
    super(`Password didn't match confirmation: ${password} and ${confirmation} are different`);
    this.name = 'PasswordMatchConfirmationError';
  }
}
