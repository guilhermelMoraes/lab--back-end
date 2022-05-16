export default class MissingRequiredParameterError extends Error {
  constructor(parameter: string) {
    super(`O parâmetro obrigatório ${parameter} não foi encontrado`);
    this.name = 'MissingRequiredPropertyError';
  }
}
