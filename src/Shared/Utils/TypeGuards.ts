export default {
  isBoolean(value: unknown): value is boolean {
    return (value === false || value === true);
  },
  isString(value: unknown): value is string {
    return typeof value === 'string';
  },
  isNotUndefined<T>(value: unknown): value is T {
    return value !== undefined && value !== null;
  },
  isError(value: unknown): value is Error {
    return value instanceof Error;
  },
};
