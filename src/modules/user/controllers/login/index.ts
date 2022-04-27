import jwtClient from '../../../../gateways/implementations/json-web-token';
import postgresDataSource from '../../../shared/infrastructure/database/config';
import { UserTypeOrmRepository } from '../../repository';
import { LoginService } from '../../services';
import LoginController from './login.controller';

const userRepository = new UserTypeOrmRepository(postgresDataSource);
const loginService = new LoginService(userRepository, jwtClient);
const loginController = new LoginController(loginService);

export default loginController;
