import { createTransport, SentMessageInfo } from 'nodemailer';
import MailerService, { VerificationProps } from '../email-service';

export default class NodeMailer implements MailerService {
  private readonly _transporter;

  // @types/nodemailer is a messy, so setting the correct type would prevent the app from running
  constructor(transport: any) {
    this._transporter = createTransport(transport);
  }

  private static craftVerificationMessage(props: VerificationProps): string {
    return `
      <h1>
        👋 Bem-vindo ao THE LAB
      </h1>
      <p>
        Para continuar utilizando o app, certifique-se de verificar sua conta.
      </p>
      <p>
        Para fazer isso é muito simples! Basta acessar o
        <a href="http://localhost:3000/verify-account" target="_blank" rel="noopener noreferrer">
          THE LAB
        </a>
        e inserir o código:
      </p>
      <h2>${props.token}</h2>
      <small>
        Atenção: contas não verificadas são arquivadas após um mês, mesmo se pertencerem a usuários ativos.
      </small>
      <small>
        Este e-mail deveria ser, originalmente, enviado para ${props.recipient}
      </small>
    `;
  }

  public async sendVerificationEmail(props: VerificationProps): Promise<void> {
    this._transporter.sendMail({
      from: 'thelab@egodev.tech',
      // FIXME: set to the actual recipient before moving to a PROD environment
      to: 'guilherme.lmoraes.devel@gmail.com',
      subject: '💌 Verificação de e-mail',
      html: NodeMailer.craftVerificationMessage(props),
    }, (error: Error | null, messageInfo: SentMessageInfo) => {
      if (error) {
        // TODO: implement logging strategy
        console.error(error);
      }

      // TODO: implement logging strategy
      console.log(messageInfo);
    });
  }
}
