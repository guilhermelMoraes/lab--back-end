import userRoutes from '@user/Infrastructure/Http/Routes';
import express, { Router } from 'express';

const router: Router = express.Router();

router.use('/user', userRoutes);

export default router;
