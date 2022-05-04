import { Result } from '@shared/domain';
import { UserProperties } from '@user/domain';

export type UserProps = Omit<UserProperties, 'hash'>;

interface JwtGateway {
  sign(payload: UserProps): Promise<Result<string | Error>>;
}

export default JwtGateway;
