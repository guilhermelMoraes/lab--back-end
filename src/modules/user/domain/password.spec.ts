/* eslint-disable @typescript-eslint/ban-ts-comment */
import faker from '@faker-js/faker';
import { Result } from '../../../shared/utils';
import { PasswordLengthError, PasswordMatchConfirmationError } from './errors';
import Password from './password';

describe('Password', () => {
  it('Should return an error if one of the properties have an invalid data type', async () => {
    const invalidPassword = await Password.create({
      // @ts-ignore
      password: undefined,
      passwordConfirmation: faker.internet.password(),
    });

    expect(invalidPassword).toEqual(Result.fail<TypeError>(new TypeError('Expect to receive a string for password and confirmation')));
  });

  it('Should return an error if password and confirmation are different', async () => {
    const password = faker.internet.password();
    const passwordConfirmation = faker.internet.password();

    const invalidPassword = await Password.create({
      password,
      passwordConfirmation,
    });

    expect(invalidPassword)
      .toEqual(Result.fail<PasswordMatchConfirmationError>(new PasswordMatchConfirmationError()));
  });

  it('Should return an error if password exceeds allowed length', async () => {
    const hugePass = faker.internet.password(31);
    const shortPass = faker.internet.password(7);

    const hugePassword = await Password.create({
      password: hugePass,
      passwordConfirmation: hugePass,
    });

    const shortPassword = await Password.create({
      password: shortPass,
      passwordConfirmation: shortPass,
    });

    expect(hugePassword)
      .toEqual(Result.fail<PasswordLengthError>(new PasswordLengthError(hugePass.length)));

    expect(shortPassword)
      .toEqual(Result.fail<PasswordLengthError>(new PasswordLengthError(shortPass.length)));
  });

  it('Should return an successful result if a valid password is provided', async () => {
    const validPass = faker.internet.password(16);

    const validPassword = await Password.create({
      password: validPass,
      passwordConfirmation: validPass,
    });

    expect(validPassword.value).toBeInstanceOf(Password);
  });
});
