export default class EmailAlreadyUsedError extends Error {
  constructor(email: string) {
    super(`${email} already used`);
    this.name = 'EmailAlreadyUsedError';
  }
}
