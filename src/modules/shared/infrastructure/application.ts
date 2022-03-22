import { config } from 'dotenv';
import express, { Application } from 'express';
import router from './router';

config();
const application: Application = express();
const HTTP_SERVER_PORT: string | number = process.env.HTTP_SERVER_PORT ?? 8000;

application.use(express.json());

application.use('/', router);

application.listen(HTTP_SERVER_PORT, (): void => {
  console.log(`Server is running on port ${HTTP_SERVER_PORT}`);
});
