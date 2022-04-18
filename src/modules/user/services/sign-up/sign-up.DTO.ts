// FIXME: DTO should stay as near as possible to the Sign-Up service, and not its controller.
type SignUpDTO = {
  email: string;
  username: string;
  password: string;
  passwordConfirmation: string;
}

export default SignUpDTO;
