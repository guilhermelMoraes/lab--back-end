export default class PasswordLengthError extends Error {
  constructor(actualLength: number) {
    super(`Password should have at least 8 characters and max 30. Got ${actualLength} charactersPassword should have at least 8 characters and a max of 30. Got ${actualLength} chars`);
    this.name = 'PasswordLengthError';
  }
}
