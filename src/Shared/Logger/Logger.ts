interface Logger {
  error(error: Error): void;
  info<T>(data: T): void;
}

export default Logger;
