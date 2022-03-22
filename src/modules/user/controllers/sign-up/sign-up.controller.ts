import Controller, { Request, Response } from '../../../shared/http/controller';
import MissingRequiredParameterError from '../../../shared/http/errors/missing-required-parameter';
import SignUp from '../../services/sign-up/sign-up.service';
import SignUpDTO from './sign-up.DTO';

type PayloadValidity = {
  parameter?: string;
  succeeds: boolean;
}

export default class SignUpController extends Controller<SignUpDTO> {
  private readonly _signUpService: SignUp;
  private readonly requiredParameters: string[] = ['email', 'username', 'password', 'passwordConfirmation'];

  constructor(signUpService: SignUp) {
    super();
    this._signUpService = signUpService;
  }

  private validatePayload(payload: SignUpDTO): PayloadValidity {
    for (const parameter of this.requiredParameters) {
      const missingRequiredParameter = !Object
        .prototype
        .hasOwnProperty
        .call(payload, parameter);

      if (missingRequiredParameter) {
        return {
          parameter,
          succeeds: missingRequiredParameter,
        };
      }
    }

    return {
      succeeds: true,
    };
  }

  public async handle<T extends SignUpDTO>(request: Request<T>): Promise<Response<string>> {
    try {
      const payloadValidation = this.validatePayload(request.payload as SignUpDTO);

      if (!payloadValidation.succeeds) {
        const { message } = new MissingRequiredParameterError(
          payloadValidation.parameter as string,
        );

        return SignUpController.badRequest<string>(message);
      }

      const signUp = await this._signUpService.execute(request.payload as SignUpDTO);
      if (signUp.isFailure) {
        return SignUpController.badRequest<string>(signUp.value as string);
      }

      return SignUpController.created();
    } catch (error) {
      // TODO: implement logging strategy
      return SignUpController.internalServerError('Internal server error. Please, try again later.');
    }
  }
}
