/* eslint-disable @typescript-eslint/ban-ts-comment */
import Login from '../../services/login/login';
import jwtClient from '../../../../gateways/implementations/json-web-token';
import LoginController from './login.controller';
import UserInMemoryRepository from '../../repository/implementations/user.in-memory';
import UserRepository from '../../repository/user.repository';
import Password from '../../domain/password';
import Result from '../../../shared/domain/result';

describe('Controller: login', () => {
  let userRepository: UserRepository;
  let loginService: Login;
  let sut: LoginController;

  beforeAll(() => {
    userRepository = new UserInMemoryRepository();
    loginService = new Login(userRepository, jwtClient);
    sut = new LoginController(loginService);
  });

  it('Should return a bad request if a required property is missing', async () => {
    const response = await sut.handle({
      // @ts-ignore
      payload: {
        email: 'john.doe@mail.com',
      },
    });

    expect(response).toEqual({
      statusCode: 400,
      payload: 'password is required but wasn\'t found',
    });
  });

  it('Should return a bad request if the email is invalid', async () => {
    const response = await sut.handle({
      payload: {
        email: 'invalid_mail',
        password: 'valid_password',
      },
    });

    expect(response).toEqual({
      statusCode: 400,
      payload: 'invalid_mail is not a valid e-mail',
    });
  });

  it('Should return a "Not found" if user does\'t exist', async () => {
    const request = {
      payload: {
        email: 'john.doe@mail.com',
        password: 'teste-123',
      },
    };

    const response = await sut.handle(request);

    expect(response).toEqual({
      statusCode: 404,
      payload: `${request.payload.email} is not associated to any users`,
    });
  });

  it(
    'Should return a "Unauthorized" status code if email or password is wrong',
    async () => {
      jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValueOnce({
        userId: 'user-id',
        email: 'bleblé',
        username: 'username',
        hash: 'teste',
      });

      const request = {
        payload: {
          email: 'john.doe@mail.com',
          password: 'teste-123',
        },
      };

      const response = await sut.handle(request);

      expect(response).toEqual({
        statusCode: 401,
        payload: 'User or password wrong',
      });
    },
  );

  it('Should return a signed jwt if everything is okay', async () => {
    process.env.JWT_PRIVATE_KEY = 'private_key_dummy';

    jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValueOnce({
      userId: 'user-id',
      email: 'bleblé',
      username: 'username',
      hash: 'teste',
    });

    jest.spyOn(Password, 'compare').mockResolvedValueOnce(Result.ok<boolean>(true));

    const request = {
      payload: {
        email: 'john.doe@mail.com',
        password: 'teste-123',
      },
    };

    const response = await sut.handle(request);

    expect(response.statusCode).toBe(200);
    expect(typeof response.payload).toBe('string');
  });
});
