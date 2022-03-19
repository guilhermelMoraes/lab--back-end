export default class InvalidEmailError extends Error {
  constructor(reason: string) {
    super(reason);
    this.name = 'InvalidEmailError';
  }
}
