import { Result } from '@shared/domain';
import {
  Email,
  Password, User, Username,
} from '@user/domain';
import { UserRepository } from '@user/repository';
import UserMapper from '@user/user-mapper';
import { EmailAlreadyUsedError } from './errors';
import SignUpDTO from './sign-up.DTO';

type Response = Promise<Result<unknown> | Result<Email> | Result<void>>;

export default class SignUp {
  private readonly _userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this._userRepository = userRepository;
  }

  public async execute(properties: SignUpDTO): Response {
    const emailOrError = Email.create(properties.email);
    const usernameOrError = Username.create(properties.username);
    const passwordOrError = await Password.create({
      password: properties.password,
      passwordConfirmation: properties.passwordConfirmation,
    });

    const combinedProperties = Result.combine([emailOrError, passwordOrError, usernameOrError]);
    if (combinedProperties.isFailure) {
      return Result.fail(combinedProperties.error as Error);
    }

    const { email } = (emailOrError.value as Email).properties;

    const userExists = await this._userRepository.findUserByEmail(email);
    if (userExists) {
      return Result.fail<EmailAlreadyUsedError>(new EmailAlreadyUsedError(email));
    }

    const user = UserMapper.toDatabase(
      new User(
        emailOrError.value as Email,
        usernameOrError.value as Username,
        passwordOrError.value as Password,
      ),
    );

    await this._userRepository.create(user);
    return Result.ok<void>();
  }
}
