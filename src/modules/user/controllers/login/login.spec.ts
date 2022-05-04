/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Result } from '../../../shared/domain';
import { Password } from '../../domain';
import { UserInMemoryRepository, UserRepository } from '../../repository';
import { LoginService, jwtClient } from '../../services';
import LoginController from './login.controller';

describe('Controller: login', () => {
  let userRepository: UserRepository;
  let loginService: LoginService;
  let sut: LoginController;

  beforeAll(() => {
    userRepository = new UserInMemoryRepository();
    loginService = new LoginService(userRepository, jwtClient);
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
      payload: 'O parâmetro obrigatório password não foi encontrado',
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
      payload: 'invalid_mail não é um e-mail válido',
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
      payload: `${request.payload.email} não está associado a nenhum usuário`,
    });
  });

  it(
    'Should return a "Unauthorized" status code if email or password is wrong',
    async () => {
      jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValueOnce({
        userId: 'user-id',
        email: 'not_an_email',
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
        payload: 'Usuário e/ou senha errado(s)',
      });
    },
  );

  it('Should return a signed jwt if everything is okay', async () => {
    process.env.JWT_PRIVATE_KEY = 'private_key_dummy';

    jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValueOnce({
      userId: 'user-id',
      email: 'valid_email',
      username: 'username',
      hash: 'valid_hash',
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
