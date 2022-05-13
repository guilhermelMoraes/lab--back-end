export type VerificationProps = {
  recipient: string;
  token: string;
}

interface MailerService {
  sendVerificationEmail(props: VerificationProps): Promise<void>;
}

export default MailerService;
