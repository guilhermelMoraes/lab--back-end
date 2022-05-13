import { UserProperties } from '@user/domain';
import UserMapper from '@user/user-mapper';
import { MailerService } from '../gateways';

export default class VerifyUserEmail {
  private readonly _mailerService: MailerService;

  constructor(mailerService: MailerService) {
    this._mailerService = mailerService;
  }

  public sendVerificationEmail(userProps: UserProperties): void {
    const user = UserMapper.toDomain(userProps);
    this._mailerService.sendVerificationEmail({
      recipient: userProps.email,
      token: user.generateVerificationToken(),
    });
  }
}
