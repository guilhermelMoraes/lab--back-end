/* eslint-disable import/first */
import { config } from 'dotenv';

config();

import 'reflect-metadata';
import express, { Application } from 'express';
import router from './router';
import postgresDataSource from './database/config';

const application: Application = express();
const HTTP_SERVER_PORT: string | number = process.env.HTTP_SERVER_PORT ?? 8000;

postgresDataSource
  .initialize()
  .then(() => console.log('[Database] Database up and running'))
  .catch((error) => console.error(error));

application.use(express.json());
application.use('/', router);

application.listen(HTTP_SERVER_PORT, (): void => {
  console.log(`[Server] Server is running on port ${HTTP_SERVER_PORT}`);
});
