import Email from '../../domain/email';

type LoginDTO = {
  email: string;
  password: string;
};

export default class Login {
  public static execute(loginDTO: LoginDTO): void {
    Email.validateEmail(loginDTO.email);
  }
}
