/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment */
import { SignUpService, SignUpDTO } from '../../services/sign-up';
import SignUpController from './sign-up.controller';
import UserInMemoryRepository from '../../repository/implementations/user.in-memory';
import { Request } from '../../../shared/http/controller';

const dummyUser: SignUpDTO = {
  email: 'john.doe@mail.com',
  username: 'john_doe',
  password: 'test-123',
  passwordConfirmation: 'test-123',
};

const fakeRequest: Request<SignUpDTO> = {
  payload: dummyUser,
};

describe('Controller: sign-up', () => {
  let userRepository: UserInMemoryRepository;
  let signUpService: SignUpService;
  let sut: SignUpController;

  beforeAll(() => {
    userRepository = new UserInMemoryRepository();
    signUpService = new SignUpService(userRepository);
    sut = new SignUpController(signUpService);
  });

  it('Should return error if a required parameter is missing', async () => {
    // @ts-ignore
    const { email, ...payloadWithoutEmail } = dummyUser;
    // @ts-ignore
    const response = await sut.handle({ payload: payloadWithoutEmail });
    expect(response).toEqual({
      statusCode: 400,
      payload: 'email is required but wasn\'t found',
    });
  });

  it('Should return an internal server error if the service throws', async () => {
    const signUpServiceThrowing = jest.spyOn(signUpService, 'execute').mockRejectedValueOnce(
      new Error('Fake error from mock'),
    );

    const response = await sut.handle(fakeRequest);
    expect(response).toEqual({
      statusCode: 500,
      payload: 'Internal server error. Please, try again later',
    });

    signUpServiceThrowing.mockRestore();
  });

  it('Should return a conflict if user tries to use an already used e-mail', async () => {
    const fakeRequestWithConflict: Request<SignUpDTO> = {
      payload: {
        email: 'john-doe123@mail.com',
        password: 'testing-123',
        passwordConfirmation: 'testing-123',
        username: 'super-john-doe',
      },
    };

    await sut.handle(fakeRequestWithConflict);
    const response = await sut.handle(fakeRequestWithConflict);
    expect(response).toEqual({
      statusCode: 409,
      payload: 'john-doe123@mail.com already used',
    });
  });

  it('Should return a bad request if username is too short', async () => {
    // @ts-ignore
    const { username, ...props } = fakeRequest.payload;

    const response = await sut.handle({
      payload: {
        username: 'jo',
        ...props,
      },
    });

    expect(response).toEqual({
      statusCode: 400,
      payload: 'Username length must be in between 4 and 100 characters. Got 2',
    });
  });

  it('Should return a bad request if password is too short', async () => {
    // @ts-ignore
    const { password, passwordConfirmation, ...props } = fakeRequest.payload;

    const response = await sut.handle({
      payload: {
        password: 'test',
        passwordConfirmation: 'test',
        ...props,
      },
    });

    expect(response).toEqual({
      statusCode: 400,
      payload: 'Password must have at least 8 and max 30 characters. Got 4',
    });
  });

  it('Should return a bad request if e-mail is non standard', async () => {
    // @ts-ignore
    const { email, ...props } = fakeRequest.payload;

    const response = await sut.handle({
      payload: {
        email: 'john-doemail.com',
        ...props,
      },
    });

    expect(response).toEqual({
      statusCode: 400,
      payload: 'john-doemail.com is not a valid e-mail',
    });
  });

  it('Should return a conflict if the password does\'t match its confirmation', async () => {
    // @ts-ignore
    const { password, passwordConfirmation, ...props } = fakeRequest.payload;

    const response = await sut.handle({
      payload: {
        password: 'testing-123',
        passwordConfirmation: 'test-123',
        ...props,
      },
    });

    expect(response).toEqual({
      statusCode: 409,
      payload: 'Password didn\'t match confirmation: testing-123 and test-123 are different',
    });
  });

  it('Should create a new user successfully', async () => {
    const response = await sut.handle(fakeRequest);
    expect(response).toEqual({
      statusCode: 201,
      payload: 'User successfully created',
    });
  });
});
