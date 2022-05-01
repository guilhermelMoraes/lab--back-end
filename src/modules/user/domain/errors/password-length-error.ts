export default class PasswordLengthError extends Error {
  constructor(actualLength: number) {
    super(`Senha deve ter no mínimo 8 e no máximo 30 caracteres. Senha atual com ${actualLength} caracteres`);
    this.name = 'PasswordLengthError';
  }
}
