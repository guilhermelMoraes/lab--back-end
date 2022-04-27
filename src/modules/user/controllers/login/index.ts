import LoginController from './login.controller';
import postgresDataSource from '../../../shared/infrastructure/database/config';
import LoginService from '../../services/login/login';
import jwtClient from '../../../../gateways/implementations/json-web-token';
import UserRepository from '../../repository/implementations/user.type-orm';

const userRepository = new UserRepository(postgresDataSource);
const loginService = new LoginService(userRepository, jwtClient);
const loginController = new LoginController(loginService);

export default loginController;
