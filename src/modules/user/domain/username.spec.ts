import faker from '@faker-js/faker';
import { UsernameLengthError } from './errors';
import Username from './username';

describe('Username', () => {
  it('Should return an error if another data type is provided', () => {
    const invalidUsername = faker.datatype.boolean();
    const sut = Username.create(invalidUsername);
    expect(sut).toEqual(new TypeError('Username expects a string but got boolean'));
  });

  it('Should return an error if the username is an empty string', () => {
    const invalidUsername = '        ';
    const sut = Username.create(invalidUsername);
    expect(sut)
      .toEqual(new UsernameLengthError(4, 100, invalidUsername.trim().length));
  });

  it('Should return a new username if a valid string is provided', () => {
    const firstName = faker.name.firstName();
    const sut = Username.create(firstName);
    expect(sut).toBeInstanceOf(Username);
  });
});
