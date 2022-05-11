export default {
  isBoolean(value: unknown): value is boolean {
    return (value === false || value === true);
  },
};
