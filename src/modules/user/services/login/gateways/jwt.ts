import { Result } from '@shared/domain';

interface JwtGateway {
  sign<T>(payload: T): Promise<Result<string | Error>>;
}

export default JwtGateway;
