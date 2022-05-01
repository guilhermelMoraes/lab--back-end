import express, { Router } from 'express';
import route from './express-route-adapter';
import { loginController, signUpController } from '../../controllers';
import { LoginDTO, SignUpDTO } from '../../services';

const router: Router = express.Router();

router.post('/sign-up', route<SignUpDTO>(signUpController));
router.post('/login', route<LoginDTO>(loginController));

export default router;
