/* eslint-disable @typescript-eslint/ban-ts-comment */
import faker from '@faker-js/faker';
import Email from './email';
import { NonStandardEmailError } from './errors';

describe('E-mail', () => {
  it('Should return an error if an invalid e-mail string was provided', () => {
    const invalidEmail = faker.animal.bear();
    const email = Email.create(invalidEmail);
    expect(email)
      .toEqual(new NonStandardEmailError(invalidEmail));
  });

  it('Should return an error if the wrong type of data was provided', () => {
    const invalidEmail = faker.datatype.boolean();
    const email = Email.create(invalidEmail);

    expect(email)
      .toEqual(
        new TypeError('E-mail expect a string, but got boolean'),
      );
  });

  it('Should return an e-mail if an actual e-mail string was provided', () => {
    const validEmail = faker.internet.email();
    const email = Email.create(validEmail);

    expect(email).toBeInstanceOf(Email);
  });
});
