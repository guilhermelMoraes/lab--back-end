export default class NonStandardEmailError extends Error {
  constructor(email: string) {
    super(`${email} is non standard`);
    this.name = 'NonStandardEmailError';
  }
}
