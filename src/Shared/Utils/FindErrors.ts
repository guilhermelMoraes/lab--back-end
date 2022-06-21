import TypeGuards from './TypeGuards';
import ValidationResponse from './ValidationResponse';

export default function findErrors(args: unknown[]): ValidationResponse {
  for (const error of args) {
    if (TypeGuards.isError(error)) {
      return {
        error,
        succeed: false,
      };
    }
  }

  return {
    succeed: true,
  };
}
