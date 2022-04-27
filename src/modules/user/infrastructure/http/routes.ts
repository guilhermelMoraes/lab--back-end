import express, { Router } from 'express';
import ExpressAdapter from '../../../shared/infrastructure/adapters/express';
import loginController from '../../controllers/login';
import signUpController from '../../controllers/sign-up';
import { LoginDTO, SignUpDTO } from '../../services';

const router: Router = express.Router();

router.post('/sign-up', ExpressAdapter.route<SignUpDTO>(signUpController));
router.post('/login', ExpressAdapter.route<LoginDTO>(loginController));

export default router;
