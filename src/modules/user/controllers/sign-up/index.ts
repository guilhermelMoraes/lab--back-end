import postgresDataSource from '../../../shared/infrastructure/database/config';
import UserTypeOrmRepository from '../../repository/implementations/user.type-orm';
import { SignUpService } from '../../services/sign-up';
import SignUpController from './sign-up.controller';

const userRepository = new UserTypeOrmRepository(postgresDataSource);
const signUpService = new SignUpService(userRepository);
const signUpController = new SignUpController(signUpService);

export default signUpController;
