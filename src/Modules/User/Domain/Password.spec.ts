/* eslint-disable @typescript-eslint/ban-ts-comment */
import faker from '@faker-js/faker';
import bcrypt from 'bcrypt';
import { LengthError, PasswordMatchConfirmationError } from './Errors';
import Password from './Password';

jest.mock('bcrypt');

describe('Password', () => {
  it('Should return an error when an invalid data type is provided', async () => {
    const sut = await Password.create({
      password: faker.internet.password(12),
      // @ts-ignore
      passwordConfirmation: faker.datatype.boolean(),
    });

    expect(sut).toEqual(new TypeError('passwordConfirmation expects a string but got boolean'));
  });

  it('Should return an error when password and confirmation don\'t match', async () => {
    const sut = await Password.create({
      password: faker.internet.password(),
      passwordConfirmation: faker.internet.password(),
    });

    expect(sut).toEqual(new PasswordMatchConfirmationError());
  });

  it('Should return an error when password length is out of allowed length', async () => {
    const validPassword = faker.internet.password(7);

    const sut = await Password.create({
      password: validPassword,
      passwordConfirmation: validPassword,
    });

    expect(sut).toEqual(new LengthError('password', validPassword.length));
  });

  xit('Should return an error if bcrypt throws', async () => {
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce((): never => {
      throw new Error('Error is thrown by Jest for testing purposes');
    });

    const validPassword = faker.internet.password(12);

    const sut = await Password.create({
      password: validPassword,
      passwordConfirmation: validPassword,
    });

    expect(sut).toBeInstanceOf(Error);
  });

  it('Should hash a password successfully', async () => {
    const validPassword = faker.internet.password(12);

    const sut = await Password.create({
      password: validPassword,
      passwordConfirmation: validPassword,
    });

    expect(sut).toBeInstanceOf(Password);
  });
});
