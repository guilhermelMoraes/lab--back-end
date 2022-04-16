import Result from '../../../shared/domain/result';
import Email from '../../domain/email';
import Password from '../../domain/password';
import { UserProperties } from '../../domain/user';
import UserRepository from '../../repository/user.repository';
import { UserOrPasswordWrongError } from './errors';

type LoginDTO = {
  email: string;
  password: string;
};

export default class Login {
  private readonly _userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this._userRepository = userRepository;
  }

  public async execute(loginDTO: LoginDTO) {
    const emailOrError = Email.validateEmail(loginDTO.email);

    if (emailOrError.isFailure) {
      return Result.fail<Error>(emailOrError.error as Error);
    }

    const email = emailOrError.value as string;
    const userProps = await this._userRepository.findUserByEmail(email);

    if (!userProps) {
      return Result.fail<UserOrPasswordWrongError>(new UserOrPasswordWrongError());
    }

    const { hash } = userProps as UserProperties;
    const passwordMatch = await Password.compare(loginDTO.password, hash);

    if (passwordMatch.isFailure) {
      return Result.fail<Error>(passwordMatch.error as Error);
    }

    if (passwordMatch.value === false) {
      return Result.fail<UserOrPasswordWrongError>(new UserOrPasswordWrongError());
    }

    return Result.ok();
  }
}
