import expressRouteAdapter from '@shared/Http/ExpressRouteAdapter';
import { signUpController } from '@user/Controllers';
import { LocalSignUpDto } from '@user/Services';
import express, { Router } from 'express';

const userRoutes: Router = express.Router();

userRoutes.post('/sign-up', expressRouteAdapter<LocalSignUpDto>(signUpController));

export default userRoutes;
