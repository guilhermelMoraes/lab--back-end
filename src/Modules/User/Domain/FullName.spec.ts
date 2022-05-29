/* eslint-disable @typescript-eslint/ban-ts-comment */
import faker from '@faker-js/faker';
import { FullNameLengthError } from './Errors';
import FullName from './FullName';

describe('Full name', () => {
  it('Should return an error when one of the names has a length smaller than 4', () => {
    const sut = FullName.create({
      firstName: faker.datatype.string(3),
      surname: faker.datatype.string(6),
    });

    expect(sut).toEqual(new FullNameLengthError('firstName', 3));
  });

  it('Should return an error when one of the names has a length bigger than 45', () => {
    const sut = FullName.create({
      firstName: faker.datatype.string(5),
      surname: faker.datatype.string(46),
    });

    expect(sut).toEqual(new FullNameLengthError('surname', 46));
  });

  it('Should return an error when an empty string is provided as a name', () => {
    const sut = FullName.create({
      firstName: '        ',
      surname: faker.name.lastName(),
    });

    expect(sut).toEqual(new FullNameLengthError('firstName', 0));
  });

  it('Should return an error when a different data type is supplied as a name', () => {
    const sut = FullName.create({
      firstName: faker.name.firstName(),
      // @ts-ignore
      surname: faker.datatype.boolean(),
    });

    expect(sut).toEqual(new TypeError('surname expects a string but got boolean'));
  });

  it('Should return a username when a valid first and surname are supplied', () => {
    const sut = FullName.create({
      firstName: faker.name.firstName(),
      surname: faker.name.lastName(),
    });

    expect(sut).toBeInstanceOf(FullName);
  });
});
