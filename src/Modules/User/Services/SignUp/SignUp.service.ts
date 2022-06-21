import Email from '@user/Domain/Email';
import { UserModel } from '@user/Infrastructure/Database';
import UserRepository from '@user/Repositories/UserRepository';
import { TypeGuards } from 'src/Shared/Utils';
import { LocalSignUpDto } from '.';
import UserAlreadyExistsError from './Errors/UserAlreadyExists';
import SignUpDto from './SignUp.DTO';
import LocalStrategy from './Strategies/Implementations/LocalStrategy';
import SignUpStrategy from './Strategies/SignUpStrategy';

export default class SignUpService {
  private readonly _userRepository: UserRepository<UserModel>;
  private _signUpStrategy!: SignUpStrategy;

  constructor(userRepository: UserRepository<UserModel>) {
    this._userRepository = userRepository;
    this.setStrategy();
  }

  private async userAlreadyExists(email: string): Promise<boolean> {
    const user = await this._userRepository.findUserByEmail(email);
    if (user) {
      return true;
    }
    return false;
  }

  public async execute(props: SignUpDto): Promise<Error | void> {
    const emailOrError = Email.create(props.email);
    if (TypeGuards.isError(emailOrError)) {
      return emailOrError;
    }

    const { email } = emailOrError.properties;
    if (await this.userAlreadyExists(email)) {
      return new UserAlreadyExistsError();
    }

    return this._signUpStrategy.signUp(props);
  }

  private setStrategy(strategy?: SignUpStrategy<SignUpDto>): void {
    this._signUpStrategy = strategy
      ?? new LocalStrategy(this._userRepository) as SignUpStrategy<LocalSignUpDto>;
  }
}
