export default class InvalidUsernameError extends Error {
  constructor(reason: string) {
    super(reason);
    this.name = 'InvalidUsernameError';
  }
}
