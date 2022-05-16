import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { Result } from '@shared/utils';
import JwtGateway, { UserProps } from '../jwt';

function generateToken(payload: UserProps): Promise<string> {
  const {
    email, userId, username, isEmailVerified,
  } = payload;

  return new Promise(
    (resolve: (value: string) => void, reject: (reason: Error) => void): void => {
      jwt.sign({ username, email, isEmailVerified },
        process.env.JWT_PRIVATE_KEY as string,
        {
          issuer: process.env.JWT_ISSUER,
          subject: userId,
          audience: process.env.JWT_AUDIENCE,
        },
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
