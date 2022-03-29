interface UserRepository {
  emailAlreadyUsed(email: string): Promise<boolean>;
}

export default UserRepository;
