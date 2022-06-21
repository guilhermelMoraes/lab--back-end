export default class LengthError extends Error {
  constructor(property: string, actualLength: number) {
    super(`${property} expects a minimum of 4 characters and a max of 45. Got ${actualLength}`);
    this.name = 'LengthError';
  }
}
