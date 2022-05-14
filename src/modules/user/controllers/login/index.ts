import postgresDataSource from '@shared/infrastructure/database/config';
import { jwtClient } from '@user/gateways';
import { UserTypeOrmRepository } from '@user/repository';
import { LoginService } from '@user/services';
import LoginController from './login.controller';

const userRepository = new UserTypeOrmRepository(postgresDataSource);
const loginService = new LoginService(userRepository, jwtClient);
const loginController = new LoginController(loginService);

export default loginController;
