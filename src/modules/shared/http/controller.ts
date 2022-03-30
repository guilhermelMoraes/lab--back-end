export type Request<T> = {
  payload?: T;
}

export type Response<T> = {
  statusCode: number;
  payload?: T;
}

export default abstract class Controller<DTO> {
  public abstract handle<T extends DTO>(request: Request<T>): Promise<any>;

  protected static badRequest<T>(payload?: T): Response<T> {
    return {
      statusCode: 400,
      payload,
    };
  }

  protected static created<T>(payload?: T): Response<T> {
    return {
      statusCode: 201,
      payload,
    };
  }

  protected static internalServerError(message: string | undefined = 'Internal server error.Please, try again later'): Response<string> {
    return {
      statusCode: 500,
      payload: message,
    };
  }

  protected static conflict(message: string): Response<string> {
    return {
      statusCode: 409,
      payload: message,
    };
  }
}
