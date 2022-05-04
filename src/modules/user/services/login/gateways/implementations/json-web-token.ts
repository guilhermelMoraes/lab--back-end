import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { Result } from '@shared/domain';
import JwtGateway from '../jwt';

type JwtPayload = Buffer | string | object;

function generateToken(payload: JwtPayload): Promise<string> {
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

function payloadValidation(payload: unknown): payload is JwtPayload {
  if (typeof payload === 'string') return true;
  if (Buffer.isBuffer(payload)) return true;
  if (Object.prototype.toString.call(payload) === '[object Object]') return true;
  return false;
}

const jwtGateway: JwtGateway = {
  async sign<T>(payload: T): Promise<Result<string | Error>> {
    if (payloadValidation(payload)) {
      try {
        const token = await generateToken(payload);
        return Result.ok<string>(token);
      } catch (jwtError) {
        return Result.fail<Error>(jwtError as JsonWebTokenError);
      }
    }

    return Result.fail<Error>(new Error('Payload provided isn\'t valid'));
  },
};

export default jwtGateway;
