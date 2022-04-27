import express, { Router } from 'express';

import ExpressAdapter from '../../../shared/infrastructure/adapters/express';
import LoginDTO from '../../services/login/login.DTO';
import SignUpDTO from '../../services/sign-up/sign-up.DTO';
import loginController from '../../controllers/login';
import signUpController from '../../controllers/sign-up';

const router: Router = express.Router();

router.post('/sign-up', ExpressAdapter.route<SignUpDTO>(signUpController));
router.post('/login', ExpressAdapter.route<LoginDTO>(loginController));

export default router;
