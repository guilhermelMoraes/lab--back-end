import postgresDataSource from '../../../shared/infrastructure/database/config';
import { UserTypeOrmRepository } from '../../repository';
import { SignUpService } from '../../services';
import SignUpController from './sign-up.controller';

const userRepository = new UserTypeOrmRepository(postgresDataSource);
const signUpService = new SignUpService(userRepository);
const signUpController = new SignUpController(signUpService);

export default signUpController;
