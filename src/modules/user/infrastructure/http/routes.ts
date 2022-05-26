import { loginController, signUpController } from '@user/controllers';
import { LoginDTO, SignUpDTO } from '@user/services';
import express, { Router } from 'express';
import expressRouteAdapter from './express-route-adapter';

const routes: Router = express.Router();

routes.post('/sign-up', expressRouteAdapter<SignUpDTO>(signUpController));
routes.post('/login', expressRouteAdapter<LoginDTO>(loginController));

export default routes;
