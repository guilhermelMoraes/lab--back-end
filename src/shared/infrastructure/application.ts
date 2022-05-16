import cors from 'cors';
import express, { Application } from 'express';
import router from './router';

const application: Application = express();
const HTTP_SERVER_PORT: string | number = process.env.HTTP_SERVER_PORT ?? 8000;

application.use(express.json());
application.use(cors({
  origin: 'http://localhost:3000',
}));

application.use('/', router);

application.listen(HTTP_SERVER_PORT, (): void => {
  // TODO: implement logging strategy
  console.log(`[Server] Server is running on port ${HTTP_SERVER_PORT}`);
});

export default application;
