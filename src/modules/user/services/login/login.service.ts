import { Result } from '@shared/domain';
import { Email, Password, UserProperties } from '@user/domain';
import { UserRepository } from '@user/repository';
import JwtGateway from './gateways/jwt';
import { UserDoesntExistError, UserOrPasswordWrongError } from './errors';
import LoginDTO from './login.DTO';

export default class Login {
  private readonly _userRepository: UserRepository;
  private readonly _jwt: JwtGateway;

  constructor(userRepository: UserRepository, jwt: JwtGateway) {
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

    const tokenOrError = await this._jwt.sign({ email, userId, username });
    if (tokenOrError.isSuccess) {
      return Result.ok<string>(tokenOrError.value as string);
    }

    return Result.fail<Error>(tokenOrError.error as Error);
  }
}
