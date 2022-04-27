import { Result } from '../../shared/domain';
import { UsernameLengthError } from './errors';
import Username from './username';

describe('Value object: username', () => {
  it('"        " should return an error', () => {
    const invalidUsername = '        ';
    const result = Username.create(invalidUsername);
    expect(result).toEqual(
      Result.fail<UsernameLengthError>(
        new UsernameLengthError(4, 100, 0),
      ),
    );
  });

  it('"john.doe" should return an successful result', () => {
    const username = 'john.doe';
    const result = Username.create(username);
    expect(result.value).toBeInstanceOf(Username);
  });
});
