export default class UsernameLengthError extends Error {
  constructor(minLength: number, maxLength: number, actualLength: number) {
    super(
      `Nome de usuário deve ter no mínimo ${minLength} e no máximo ${maxLength} caracteres. Recebido(s) ${actualLength} caracter(es)`,
    );
    this.name = 'UsernameLengthError';
  }
}
