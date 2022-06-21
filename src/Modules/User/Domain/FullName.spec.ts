/* eslint-disable @typescript-eslint/ban-ts-comment */
import faker from '@faker-js/faker';
import { LengthError } from './Errors';
import FullName from './FullName';

describe('Full name', () => {
  it('Should return an error when no data is provided', () => {
    // @ts-ignore
    const sut = FullName.create();
    expect(sut).toEqual(new TypeError('fullName expects an object with firstName and surname as strings'));
  });

  it('Should return an error when one of the names has a length smaller than 4', () => {
    const sut = FullName.create({
      firstName: faker.datatype.string(3),
      surname: faker.datatype.string(6),
    });

    expect(sut).toEqual(new LengthError('firstName', 3));
  });

  it('Should return an error when one of the names has a length bigger than 45', () => {
    const sut = FullName.create({
      firstName: faker.datatype.string(5),
      surname: faker.datatype.string(46),
    });

    expect(sut).toEqual(new LengthError('surname', 46));
  });

  it('Should return an error when an empty string is provided as a name', () => {
    const sut = FullName.create({
      firstName: '        ',
      surname: faker.name.lastName(),
    });

    expect(sut).toEqual(new LengthError('firstName', 0));
  });

  it('Should return a username when a valid first and surname are supplied', () => {
    const sut = FullName.create({
      firstName: faker.name.firstName(),
      surname: faker.name.lastName(),
    });

    expect(sut).toBeInstanceOf(FullName);
  });
});
