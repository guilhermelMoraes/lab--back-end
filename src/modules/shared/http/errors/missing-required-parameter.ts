export default class MissingRequiredParameterError extends Error {
  constructor(parameter: string) {
    super(`${parameter} is required but wasn't found`);
    this.name = 'MissingRequiredPropertyError';
  }
}
