import postgresDataSource from '@shared/infrastructure/database/config';
import { UserTypeOrmRepository } from '@user/repository';
import { LoginService, jwtClient } from '@user/services';
import LoginController from './login.controller';

const userRepository = new UserTypeOrmRepository(postgresDataSource);
const loginService = new LoginService(userRepository, jwtClient);
const loginController = new LoginController(loginService);

export default loginController;
