/* eslint-disable class-methods-use-this */
import { UserProperties } from '@user/domain';
import User from '@user/infrastructure/database/user.model';
import { NodeMailer, VerifyUserEmail } from '@user/services';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';

@EventSubscriber()
export default class UserCreatedEvent implements EntitySubscriberInterface<User> {
  private sendVerificationEmail(user: UserProperties): void {
    const nodeMailer = new NodeMailer();
    const verifyUserEmailService = new VerifyUserEmail(nodeMailer);
    verifyUserEmailService.sendVerificationEmail(user);
  }

  public afterInsert({ entity }: InsertEvent<User>): void {
    this.sendVerificationEmail(entity);
  }
}
