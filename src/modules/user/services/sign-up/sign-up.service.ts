import Result from '../../../shared/domain/result';
import Email from '../../domain/email';
import InvalidEmailError from '../../domain/errors/invalid-email';
import Password from '../../domain/password';
import UserRepository from '../../repository/user.repository';
import SignUpDTO from '../../controllers/sign-up/sign-up.DTO';
import Username from '../../domain/username';

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
      return Result.fail(combinedProperties.error);
    }

    const { email } = emailOrError.value.properties;
    const emailAlreadyUsed = await this._userRepository.emailAlreadyUsed(email);
    if (emailAlreadyUsed) {
      return Result.fail<Email>(new InvalidEmailError('E-mail already being used').message);
    }

    return Result.ok<void>();
  }
}
