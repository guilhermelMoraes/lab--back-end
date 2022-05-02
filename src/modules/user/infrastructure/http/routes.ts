import express, { Router } from 'express';

import { loginController, signUpController } from '@user/controllers';
import { LoginDTO, SignUpDTO } from '@user/services';
import route from './express-route-adapter';

const router: Router = express.Router();

router.post('/sign-up', route<SignUpDTO>(signUpController));
router.post('/login', route<LoginDTO>(loginController));

export default router;
