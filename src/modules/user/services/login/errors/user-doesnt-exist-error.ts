export default class UserDoesntExistError extends Error {
  constructor(email: string) {
    super(`${email} não está associado a nenhum usuário`);
    this.name = 'UserDoesntExistError';
  }
}
