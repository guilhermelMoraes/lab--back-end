export default class EmailAlreadyUsedError extends Error {
  constructor(email: string) {
    super(`${email} já utilizado`);
    this.name = 'EmailAlreadyUsedError';
  }
}
