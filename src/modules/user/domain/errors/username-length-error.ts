export default class UsernameLengthError extends Error {
  constructor(minLength: number, maxLength: number, actualLength: number) {
    super(
      `Username should have at least ${minLength} and max ${maxLength} chars. Got ${actualLength} chars`,
    );
    this.name = 'UsernameLengthError';
  }
}
