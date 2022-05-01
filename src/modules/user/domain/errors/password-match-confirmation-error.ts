export default class PasswordMatchConfirmationError extends Error {
  constructor(password: string, confirmation: string) {
    super(`Senha é diferente da confirmação: ${password} e ${confirmation} são diferentes`);
    this.name = 'PasswordMatchConfirmationError';
  }
}
