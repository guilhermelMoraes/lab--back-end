import { Result } from '../../shared/utils';
import Email from './email';
import { NonStandardEmailError } from './errors';

describe('Value object: e-mail', () => {
  it('"john.doe.com" should return an error result', () => {
    const invalidEmail = 'john.doe.com';
    const result = Email.create(invalidEmail);
    expect(result).toEqual(
      Result.fail<NonStandardEmailError>(new NonStandardEmailError(invalidEmail)),
    );
  });

  it('"john.doe@mail.com" should return an successful result', () => {
    const validEmail = 'john.doe@mail.com';
    const result = Email.create(validEmail);
    expect(result.value).toBeInstanceOf(Email);
  });
});
