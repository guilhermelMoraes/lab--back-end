import Result from '../modules/shared/domain/result';

interface JwtClient {
  sign<T>(payload: T): Promise<Result<string | Error>>;
}

export default JwtClient;
