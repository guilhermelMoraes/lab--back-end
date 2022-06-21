/* eslint-disable max-len */
import { Controller, Request, Response } from '@shared/Http';
import { TypeGuards } from '@shared/Utils';
import { InvalidEmailError, LengthError, PasswordMatchConfirmationError } from '@user/Domain';
import { SignUpService } from '@user/Services';
import UserAlreadyExistsError from '@user/Services/SignUp/Errors/UserAlreadyExists';
import SignUpDto from '@user/Services/SignUp/SignUp.DTO';

export default class SignUpController extends Controller<SignUpDto> {
  private readonly _signUpService: SignUpService;

  constructor(signUpService: SignUpService) {
    super();
    this._signUpService = signUpService;
  }

  public async handle<T extends SignUpDto>(request: Request<T>): Promise<Response<string>> {
    try {
      const successOrError = await this._signUpService.execute(request.payload as SignUpDto);

      if (TypeGuards.isError(successOrError)) {
        switch (successOrError.constructor) {
          case PasswordMatchConfirmationError:
          case LengthError:
          case InvalidEmailError:
          case TypeError:
            return SignUpController.badRequest(successOrError.message);
          case UserAlreadyExistsError:
            return SignUpController.conflict(successOrError.message);
          default:
            this._logger.error(successOrError);
            return SignUpController.internalServerError();
        }
      }

      return SignUpController.created();
    } catch (error) {
      this._logger.error(error as Error);
      return SignUpController.internalServerError();
    }
  }
}
