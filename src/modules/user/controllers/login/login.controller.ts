import Controller, { Request, validatePayload } from '../../../shared/http/controller';
import MissingRequiredParameterError from '../../../shared/http/errors/missing-required-parameter';
import { LoginDTO, LoginService } from '../../services';

export default class LoginController extends Controller<LoginDTO> {
  private readonly _loginService: LoginService;

  constructor(loginService: LoginService) {
    super();
    this._loginService = loginService;
  }

  public async handle<T extends LoginDTO>(request: Request<T>): Promise<any> {
    const payloadValidation = validatePayload<LoginDTO>(
      request.payload as LoginDTO,
      ['email', 'password'],
    );

    if (!payloadValidation.succeeds) {
      const { message } = new MissingRequiredParameterError(payloadValidation.parameter as string);

      return LoginController.badRequest<string>(message);
    }

    const login = await this._loginService.execute(request.payload as LoginDTO);

    if (login.isFailure) {
      const { name, message } = login.error as Error;

      switch (name) {
        case 'UserDoesntExistError':
          return LoginController.notFound(message);
        case 'UserOrPasswordWrongError':
          return LoginController.unauthorized(message);
        case 'NonStandardEmailError':
          return LoginController.badRequest(message);
        default: {
          return LoginController.internalServerError();
        }
      }
    }

    return LoginController.ok<string>(login.value as string);
  }
}
