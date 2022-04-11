/* eslint-disable @typescript-eslint/ban-ts-comment */
import SignUp from '../../services/sign-up/sign-up.service';
import SignUpController from './sign-up.controller';
import UserInMemoryRepository from '../../repository/implementations/user.in-memory';
import SignUpDTO from './sign-up.DTO';
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
  let signUpService: SignUp;
  let sut: SignUpController;

  beforeAll(() => {
    userRepository = new UserInMemoryRepository();
    signUpService = new SignUp(userRepository);
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

  it('Should create a new user successfully', async () => {
    const response = await sut.handle(fakeRequest);
    expect(response).toEqual({
      statusCode: 201,
      payload: 'User successfully created',
    });
  });
});
