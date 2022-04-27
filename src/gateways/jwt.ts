import { Result } from '../modules/shared/domain';

interface JwtClient {
  sign<T>(payload: T): Promise<Result<string | Error>>;
}

export default JwtClient;
