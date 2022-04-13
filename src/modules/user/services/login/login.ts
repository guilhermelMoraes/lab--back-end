import Result from '../../../shared/domain/result';
import Email from '../../domain/email';
import UserRepository from '../../repository/user.repository';
import { UserDoesntExistError } from './errors/user-doesnt-exist-error';

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
      return Result.fail<UserDoesntExistError>(new UserDoesntExistError(email));
    }

    return Result.ok();
  }
}
