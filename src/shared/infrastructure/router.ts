import express, { Router } from 'express';
import userRoutes from '@user/infrastructure/http/routes';

const router: Router = express.Router();

router.use('/user', userRoutes);

export default router;
