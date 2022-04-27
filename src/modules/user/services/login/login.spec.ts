import Login from './login.service';
import UserInMemoryRepository from '../../repository/implementations/user.in-memory';
import UserRepository from '../../repository/user.repository';
import Result from '../../../shared/domain/result';
import { Password, NonStandardEmailError } from '../../domain';
import { UserDoesntExistError, UserOrPasswordWrongError } from './errors';
import JwtClient from '../../../../gateways/jwt';

jest.mock('../../domain/password', () => ({
  compare: () => true,
}));

class JwtClientStub implements JwtClient {
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
  let jwtClientStub: JwtClient;

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

    jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValueOnce({
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
    });

    const response = await sut.execute(validUserDummy);
    expect(response).toEqual(Result.ok<string>('valid_token'));
  });
});
