import postgresDataSource from '@shared/Infrastructure/Database/Config';
import UserTypeOrmRepository from '@user/Repositories/Implementations/UserTypeOrmRepository';
import { SignUpService } from '@user/Services';
import SignUpController from './SignUp.controller';

const userRepository = new UserTypeOrmRepository(postgresDataSource);
const signUpService = new SignUpService(userRepository);
const signUpController = new SignUpController(signUpService);

export default signUpController;
