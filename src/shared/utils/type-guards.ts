export default {
  isBoolean(value: unknown): value is boolean {
    return (value === false || value === true);
  },
  isString(arg: unknown | unknown[]): arg is string {
    if (Array.isArray(arg)) {
      return arg.every((value) => typeof value === 'string');
    }
    return typeof arg === 'string';
  },
  isNotUndefined<T>(value: unknown): value is T {
    return value !== undefined && value !== null;
  },
  isError(value: unknown): value is Error {
    return value instanceof Error;
  },
};
