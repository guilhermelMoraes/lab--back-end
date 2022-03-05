export default class InvalidEmailError extends Error {
  constructor(email: string) {
    super(`${email} isn\t a valid e-mail`);
    this.name = 'InvalidEmailError';
  }
}
