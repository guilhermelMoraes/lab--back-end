import SignUpDTO from './sign-up.DTO';
import { NonStandardEmailError } from '../../domain/errors';
import { EmailAlreadyUsedError } from './errors';
import UserInMemoryRepository from '../../repository/implementations/user.in-memory';
import SignUpService from './sign-up.service';

describe('Service: sign-up', () => {
  let sut: SignUpService;

  beforeAll(() => {
    const userInMemoryRepo = new UserInMemoryRepository();
    sut = new SignUpService(userInMemoryRepo);
  });

  it('Should return an error if one of the DTO properties fail', async () => {
    const dummyInvalidUser: SignUpDTO = {
      email: 'not_valid_email',
      username: 'john-doe',
      password: 'test-123',
      passwordConfirmation: 'test-123',
    };

    const result = await sut.execute(dummyInvalidUser);
    expect(result.error).toBeInstanceOf(NonStandardEmailError);
  });

  it('Should return an error if the email has been used', async () => {
    const dummyUser: SignUpDTO = {
      email: 'john.doe@mail.com',
      username: 'john-doe',
      password: 'test-123',
      passwordConfirmation: 'test-123',
    };

    const firstEntry = await sut.execute(dummyUser);
    expect(firstEntry.isSuccess).toBeTruthy();
    const secondEntry = await sut.execute(dummyUser);
    expect(secondEntry.value).toBeInstanceOf(EmailAlreadyUsedError);
  });
});
