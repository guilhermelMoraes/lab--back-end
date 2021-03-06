/* eslint-disable class-methods-use-this */
import { SendRawEmailCommand, SES } from '@aws-sdk/client-ses';
import { UserProperties } from '@user/domain';
import { NodeMailer } from '@user/gateways';
import User from '@user/infrastructure/database/user.model';
import { VerifyUserEmail } from '@user/services';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';

@EventSubscriber()
export default class UserCreatedEvent implements EntitySubscriberInterface<User> {
  private sendVerificationEmail(user: UserProperties): void {
    const ses = new SES({
      region: 'us-east-1',
    });

    const awsSesTransport = {
      SES: {
        ses,
        aws: { SendRawEmailCommand },
      },
    };

    const nodeMailer = new NodeMailer(awsSesTransport);
    const verifyUserEmailService = new VerifyUserEmail(nodeMailer);
    verifyUserEmailService.sendVerificationEmail(user);
  }

  public afterInsert({ entity }: InsertEvent<User>): void {
    this.sendVerificationEmail(entity);
  }
}
