import {
  Controller,
  Request,
} from '@shared/http';
import { LoginDTO, LoginService } from '@user/services';

export default class LoginController extends Controller<LoginDTO> {
  private readonly _loginService: LoginService;

  constructor(loginService: LoginService) {
    super();
    this._loginService = loginService;
  }

  public async handle<T extends LoginDTO>(request: Request<T>): Promise<any> {
    const login = await this._loginService.execute(request.payload as LoginDTO);

    if (login.isFailure) {
      const { name, message } = login.error as Error;

      switch (name) {
        case 'UserDoesntExistError':
          return LoginController.notFound(message);
        case 'UserOrPasswordWrongError':
          return LoginController.unauthorized(message);
        case 'NonStandardEmailError':
        case 'TypeError':
          return LoginController.badRequest<string>(message);
        default: {
          return LoginController.internalServerError();
        }
      }
    }

    return LoginController.ok<string>(login.value as string);
  }
}
