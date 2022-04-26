import jwt from 'jsonwebtoken';
import Result from '../../modules/shared/domain/result';
import JwtClient from '../jwt';

type JwtPayload = Buffer | string | object;

function generateToken(payload: JwtPayload): Promise<string> {
  return new Promise(
    (resolve: (value: string) => void, reject: (reason: Error) => void): void => {
      jwt.sign(payload, 'secret', {}, (jwtError: Error | null, token?: string): void => {
        if (jwtError) reject(jwtError);
        resolve(token as string);
      });
    },
  );
}

function payloadValidation(payload: any): payload is JwtPayload {
  if (typeof payload === 'string') return true;

  if (Buffer.isBuffer(payload)) return true;

  if (Object.prototype.toString.call(payload) === '[object Object]') return true;

  return false;
}

const jwtGateway: JwtClient = {
  async sign<T>(payload: T): Promise<Result<string | Error>> {
    if (payloadValidation(payload)) {
      try {
        const token = await generateToken(payload);
        return Result.ok<string>(token);
      } catch (jwtError) {
        return Result.fail<Error>(jwtError as Error);
      }
    }

    return Result.fail<Error>(new Error('Payload provided isn\'t valid'));
  },
};

export default jwtGateway;
