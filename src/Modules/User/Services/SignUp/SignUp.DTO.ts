import { FullNameProperties } from '@user/Domain';

type RequiredPropertiesDto = {
  email: string;
  fullName: FullNameProperties;
}

export type LocalSignUpDto = RequiredPropertiesDto & {
  password: string;
  passwordConfirmation: string;
}

export type GoogleSignUpDto = RequiredPropertiesDto & {
  emailVerified: boolean;
}

type SignUpDto = LocalSignUpDto | GoogleSignUpDto

export default SignUpDto;
