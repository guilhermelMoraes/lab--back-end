interface SignUpStrategy<Payload = unknown> {
  signUp<T extends Payload>(properties: T): Promise<Error | void>;
}

export default SignUpStrategy;
