export default class NonStandardEmailError extends Error {
  constructor(email: string) {
    super(`${email} não é um e-mail válido`);
    this.name = 'NonStandardEmailError';
  }
}
