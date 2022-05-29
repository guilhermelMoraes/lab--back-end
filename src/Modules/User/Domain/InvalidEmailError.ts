export default class InvalidEmailError extends Error {
  constructor(email: string) {
    super(`${email} is not a valid e-mail`);
    this.name = 'InvalidEmailError';
  }
}
