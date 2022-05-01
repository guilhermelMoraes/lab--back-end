export default class UserOrPasswordWrongError extends Error {
  constructor() {
    super('Usuário e/ou senha errado(s)');
    this.name = 'UserOrPasswordWrongError';
  }
}
