import JwtClient from '../../../../gateways/jwt';
import Result from '../../../shared/domain/result';
import Email from '../../domain/email';
import Password from '../../domain/password';
import { UserProperties } from '../../domain/user';
import UserRepository from '../../repository/user.repository';
import { UserDoesntExistError, UserOrPasswordWrongError } from './errors';
import LoginDTO from './login.DTO';

type UserProps = Omit<UserProperties, 'hash'>;

export default class Login {
  private readonly _userRepository: UserRepository;
  private readonly _jwt: JwtClient;

  constructor(userRepository: UserRepository, jwt: JwtClient) {
    this._userRepository = userRepository;
    this._jwt = jwt;
  }

  public async execute(loginDTO: LoginDTO): Promise<Result<string> | Result<Error>> {
    const emailOrError = Email.validateEmail(loginDTO.email);

    if (emailOrError.isFailure) {
      return Result.fail<Error>(emailOrError.error as Error);
    }

    const email = emailOrError.value as string;
    const userProps = await this._userRepository.findUserByEmail(email);

    if (!userProps) {
      return Result.fail<UserDoesntExistError>(new UserDoesntExistError(email));
    }

    const { hash, userId, username } = userProps as UserProperties;
    const passwordMatch = await Password.compare(loginDTO.password, hash);

    if (passwordMatch.isFailure) {
      return Result.fail<Error>(passwordMatch.error as Error);
    }

    if (passwordMatch.value === false) {
      return Result.fail<UserOrPasswordWrongError>(new UserOrPasswordWrongError());
    }

    const tokenOrError = await this._jwt.sign<UserProps>({ email, userId, username });
    if (tokenOrError.isSuccess) {
      return Result.ok<string>(tokenOrError.value as string);
    }

    return Result.fail<Error>(tokenOrError.error as Error);
  }
}
