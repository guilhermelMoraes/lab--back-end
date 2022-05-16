import { Result } from '../../shared/utils';
import { PasswordLengthError, PasswordMatchConfirmationError } from './errors';
import Password from './password';

jest.mock('bcrypt', () => ({
  hash: () => 'hashed-password',
}));

describe('Value object: password', () => {
  it('"bad-pas" password should return an error if confirmation is different', async () => {
    const invalidPass = {
      password: 'password',
      passwordConfirmation: 'password-confirmation',
    };

    const sut = await Password.create(invalidPass);
    expect(sut).toEqual(Result.fail<PasswordMatchConfirmationError>(
      new PasswordMatchConfirmationError(invalidPass.password, invalidPass.passwordConfirmation),
    ));
  });

  it('should return an error if the password length is less than 8 chars', async () => {
    const invalidPass = {
      password: '0123456',
      passwordConfirmation: '0123456',
    };

    const sut = await Password.create(invalidPass);
    expect(sut).toEqual(Result.fail<PasswordLengthError>(
      new PasswordLengthError(invalidPass.password.length),
    ));
  });

  it('should return a successful result', async () => {
    const validPassword = {
      password: 'goodPassword_202#!',
      passwordConfirmation: 'goodPassword_202#!',
    };

    const sut = await Password.create(validPassword);
    const { hash } = (sut.value as Password).properties;
    expect(hash).toBe('hashed-password');
  });
});
