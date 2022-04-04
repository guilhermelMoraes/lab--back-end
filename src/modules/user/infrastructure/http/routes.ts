import express, { Router } from 'express';
import ExpressAdapter from '../../../shared/infrastructure/adapters/express';
import signUpController from '../../controllers/sign-up';
import SignUpDTO from '../../controllers/sign-up/sign-up.DTO';

const router: Router = express.Router();

router.post('/sign-up', ExpressAdapter.route<SignUpDTO>(signUpController));

export default router;
