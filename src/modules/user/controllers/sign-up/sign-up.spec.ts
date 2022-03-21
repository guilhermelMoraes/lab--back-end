import UserRepository from '../../repositories/user';
import SignUp from '../../services/sign-up/sign-up';
import SignUpDTO from './sign-up.DTO';
import SignUpController from './sign-up.controller';

const dummyUser: SignUpDTO = {
  email: 'john.doe@mail.com',
  username: 'john-doe-saurus',
  password: 'teste-123',
  passwordConfirmation: 'teste-123',
};

class UserRepositoryStub implements UserRepository {
  // eslint-disable-next-line class-methods-use-this
  public async emailAlreadyUsed(): Promise<boolean> {
    return false;
  }
}

describe('Service: sign-up', () => {
  let signUpService: SignUp;
  let userRepoStub: UserRepository;

  beforeAll(() => {
    userRepoStub = new UserRepositoryStub();
    signUpService = new SignUp(userRepoStub);
  });

  it('teste', async () => {
    const sut = new SignUpController(signUpService);
    await sut.handle({ payload: dummyUser });
  });
});
