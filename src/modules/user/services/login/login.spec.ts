import { Result } from '../../../../shared/utils';
import { NonStandardEmailError, Password } from '../../domain';
import { JwtGateway } from '../../gateways';
import { UserInMemoryRepository, UserRepository } from '../../repository';
import { UserDoesntExistError, UserOrPasswordWrongError } from './errors';
import Login from './login.service';

jest.mock('../../domain/password', () => ({
  compare: () => true,
}));

class JwtClientStub implements JwtGateway {
  // eslint-disable-next-line class-methods-use-this
  public async sign<T>(payload: T): Promise<Result<string | Error>> {
    return Promise.resolve(Result.ok<string>('valid_token'));
  }
}

const validUserDummy = {
  email: 'john.doe@mail.com',
  password: 'valid-password',
};

describe('Service: login', () => {
  let sut: Login;
  let userRepository: UserRepository;
  let jwtClientStub: JwtGateway;

  beforeAll(() => {
    userRepository = new UserInMemoryRepository();
    jwtClientStub = new JwtClientStub();

    sut = new Login(userRepository, jwtClientStub);
  });

  it('Should return an error if the e-mail is not valid', async () => {
    const dummyInvalidLoginData = {
      email: 'johnmail.com',
      password: 'valid-password',
    };

    const response = await sut.execute(dummyInvalidLoginData);
    expect(response).toEqual(
      Result.fail<NonStandardEmailError>(new NonStandardEmailError(dummyInvalidLoginData.email)),
    );
  });

  it('Should return an error if trying to login with non existing user', async () => {
    const response = await sut.execute(validUserDummy);
    expect(response).toEqual(
      Result.fail<UserDoesntExistError>(new UserDoesntExistError(validUserDummy.email)),
    );
  });

  it('Should return an error if password provided doesn\'t match the hash', async () => {
    jest.spyOn(Password, 'compare').mockResolvedValueOnce(Result.ok<boolean>(false));

    jest
      .spyOn(userRepository, 'findUserByEmail')
      .mockResolvedValueOnce({
        email: 'valid_email',
        userId: 'valid_id',
        hash: 'invalid_username',
        username: 'any_username',
      });

    const response = await sut.execute(validUserDummy);
    expect(response).toEqual(Result.fail<UserOrPasswordWrongError>(new UserOrPasswordWrongError()));
  });

  it('Should return a token if the password matches', async () => {
    jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValueOnce({
      email: 'valid_email',
      userId: 'valid_id',
      hash: 'valid_hash',
      username: 'valid_username',
      isEmailVerified: false,
    });

    const response = await sut.execute(validUserDummy);
    expect(response).toEqual(Result.ok<string>('valid_token'));
  });
});
