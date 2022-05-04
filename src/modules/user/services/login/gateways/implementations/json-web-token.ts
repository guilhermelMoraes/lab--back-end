import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { Result } from '@shared/domain';
import JwtGateway, { UserProps } from '../jwt';

function generateToken(payload: UserProps): Promise<string> {
  return new Promise(
    (resolve: (value: string) => void, reject: (reason: Error) => void): void => {
      jwt.sign(payload,
        process.env.JWT_PRIVATE_KEY as string,
        {},
        (jwtError: Error | null, token?: string): void => {
          if (jwtError) reject(jwtError);
          resolve(token as string);
        });
    },
  );
}

const jwtGateway: JwtGateway = {
  async sign(payload: UserProps): Promise<Result<string | Error>> {
    try {
      const token = await generateToken(payload);
      return Result.ok<string>(token);
    } catch (jwtError) {
      return Result.fail<Error>(jwtError as JsonWebTokenError);
    }
  },
};

export default jwtGateway;
