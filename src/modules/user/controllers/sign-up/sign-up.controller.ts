import {
  Controller, Request,
  Response,
} from '@shared/http';
import { SignUpDTO, SignUpService } from '@user/services';

export default class SignUpController extends Controller<SignUpDTO> {
  private readonly _signUpService: SignUpService;

  constructor(signUpService: SignUpService) {
    super();
    this._signUpService = signUpService;
  }

  public async handle<T extends SignUpDTO>(request: Request<T>): Promise<Response<string>> {
    try {
      const signUp = await this._signUpService.execute(request.payload as SignUpDTO);
      if (signUp.isFailure) {
        const { name, message } = (signUp.error) as Error;

        switch (name) {
          case 'NonStandardEmailError':
          case 'PasswordLengthError':
          case 'UsernameLengthError':
          case 'TypeError':
            return SignUpController.badRequest<string>(message);
          case 'EmailAlreadyUsedError':
          case 'PasswordMatchConfirmationError':
            return SignUpController.conflict(message);
          default:
            // TODO: implement logging strategy
            return SignUpController.internalServerError();
        }
      }

      return SignUpController.created('Usuário criado com sucesso');
    } catch (error) {
      // TODO: add logging strategy
      return SignUpController.internalServerError();
    }
  }
}
