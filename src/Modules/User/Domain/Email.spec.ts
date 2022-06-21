/* eslint-disable @typescript-eslint/ban-ts-comment */
import faker from '@faker-js/faker';
import Email from './Email';
import InvalidEmailError from './Errors/InvalidEmail';

describe('E-mail', () => {
  it('Should return an error when an invalid e-mail is provided', () => {
    const invalidEmail = faker.internet.domainName();
    const sut = Email.create(invalidEmail);
    expect(sut).toEqual(new InvalidEmailError(invalidEmail));
  });

  it('Should return an error when an invalid data type is provided as e-mail', () => {
    const invalidEmail = faker.datatype.boolean();
    // @ts-ignore
    const sut = Email.create(invalidEmail);
    expect(sut).toEqual(new TypeError(`E-mail expects a string but got ${typeof invalidEmail}`));
  });

  it('Should return a new E-mail instance when a valid e-mail string is provided', () => {
    const validEmail = faker.internet.email();
    const sut = Email.create(validEmail);
    expect(sut).toBeInstanceOf(Email);
  });
});
