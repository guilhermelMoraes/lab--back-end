import { AppLogger, logger } from '@shared/logger';

export type Request<T> = {
  payload?: T;
}

export type Response<T> = {
  statusCode: number;
  payload?: T;
}

export default abstract class Controller<DTO> {
  protected readonly _logger: AppLogger = logger;

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

  protected static internalServerError(message = 'Erro interno do servidor. Tente novamente mais tarde'): Response<string> {
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

  protected static notFound(message = 'Recurso não encontrado'): Response<string> {
    return {
      statusCode: 404,
      payload: message,
    };
  }

  protected static unauthorized(message = 'Sem autorização'): Response<string> {
    return {
      statusCode: 401,
      payload: message,
    };
  }

  protected static ok<T>(payload: T): Response<T> {
    return {
      statusCode: 200,
      payload,
    };
  }
}
