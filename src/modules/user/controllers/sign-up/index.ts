import postgresDataSource from '../../../shared/infrastructure/database/config';
import UserTypeOrmRepository from '../../repository/implementations/user.type-orm';
import SignUp from '../../services/sign-up/sign-up.service';
import SignUpController from './sign-up.controller';

const userRepository = new UserTypeOrmRepository(postgresDataSource);
const signUpService = new SignUp(userRepository);
const signUpController = new SignUpController(signUpService);

export default signUpController;
