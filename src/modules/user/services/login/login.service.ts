import { Result } from '@shared/utils';
import { Email, Password, UserProperties } from '@user/domain';
import { JwtGateway } from '@user/gateways';
import { UserRepository } from '@user/repository';
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

    const {
      hash, userId,
      username, isEmailVerified,
    } = userProps;
    const passwordMatch = await Password.compare(loginDTO.password, hash);
    if (passwordMatch.isFailure) {
      return Result.fail<Error>(passwordMatch.error as Error);
    }

    if (passwordMatch.value === false) {
      return Result.fail<UserOrPasswordWrongError>(new UserOrPasswordWrongError());
    }

    const tokenOrError = await this._jwt.sign({
      email, userId, username, isEmailVerified,
    });
    if (tokenOrError.isSuccess) {
      return Result.ok<string>(tokenOrError.value as string);
    }

    return Result.fail<Error>(tokenOrError.error as Error);
  }
}
