export default class FullNameLengthError extends Error {
  constructor(name: string, actualLength: number) {
    super(`${name} expects a minimum of 4 characters and a max of 45. Got ${actualLength}`);
    this.name = 'FullNameLengthError';
  }
}
