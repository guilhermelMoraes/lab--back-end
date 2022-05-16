export default class Result<T> {
  public readonly isSuccess: boolean;
  public readonly isFailure: boolean;
  public readonly error?: Error;
  private readonly _value?: T;

  private constructor(isSuccess: boolean, error?: Error, value?: T) {
    if (isSuccess && error) {
      throw new Error('InvalidOperation: a result cannot be successful and contain an error');
    }

    if (!isSuccess && !error) {
      throw new Error('InvalidOperation: a failing result needs to contain an error message');
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error;
    this._value = value;

    Object.freeze(this);
  }

  public get value(): T {
    if (!this.isSuccess) {
      return this.error as unknown as T;
    }

    return this._value as T;
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, undefined, value);
  }

  public static fail<U>(error: Error): Result<U> {
    return new Result<U>(false, error);
  }

  public static combine(results: Result<any>[]): Result<any> {
    for (const result of results) {
      if (result.isFailure) return result;
    }

    return Result.ok<any>();
  }
}
