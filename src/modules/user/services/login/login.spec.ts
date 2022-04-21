import Login from './login';
import UserInMemoryRepository from '../../repository/implementations/user.in-memory';
import UserRepository from '../../repository/user.repository';
import Result from '../../../shared/domain/result';
import { NonStandardEmailError } from '../../domain/errors';
import { UserOrPasswordWrongError } from './errors';

describe('Service: login', () => {
  let sut: Login;
  let userRepository: UserRepository;

  beforeAll(() => {
    userRepository = new UserInMemoryRepository();
    sut = new Login(userRepository);
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
    const nonExistingUserDummy = {
      email: 'john.doe@mail.com',
      password: 'valid-password',
    };

    const response = await sut.execute(nonExistingUserDummy);
    expect(response).toEqual(
      Result.fail<UserOrPasswordWrongError>(new UserOrPasswordWrongError()),
    );
  });

  it.todo('Should return an error if password provided doesn\'t match the hash');
});
