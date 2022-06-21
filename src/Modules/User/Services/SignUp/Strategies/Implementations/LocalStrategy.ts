import { findErrors } from 'src/Shared/Utils';
import {
  Email, FullName, Password, User,
} from '@user/Domain';
import { UserModel } from '@user/Infrastructure/Database';
import UserRepository from '@user/Repositories/UserRepository';
import UserMapper from '@user/UserMapper';
import { LocalSignUpDto } from '../../SignUp.DTO';
import SignUpStrategy from '../SignUpStrategy';

export default class LocalStrategy implements SignUpStrategy<LocalSignUpDto> {
  private readonly _userRepository: UserRepository<UserModel>;

  constructor(userRepository: UserRepository<UserModel>) {
    this._userRepository = userRepository;
  }

  public async signUp<T extends LocalSignUpDto>(properties: T): Promise<Error | void> {
    const emailOrError = Email.create(properties.email);
    const fullNameOrError = FullName.create(properties.fullName);
    const passwordOrError = await Password.create({
      password: properties.password,
      passwordConfirmation: properties.passwordConfirmation,
    });

    const validation = findErrors([emailOrError, fullNameOrError, passwordOrError]);

    if (!validation.succeed) {
      return validation.error;
    }

    const userProps = UserMapper.getProperties(new User({
      email: emailOrError as Email,
      fullName: fullNameOrError as FullName,
      hash: passwordOrError as Password,
    }));

    await this._userRepository.create(userProps);
  }
}
