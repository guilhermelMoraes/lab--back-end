/* eslint-disable import/first */
import { logger } from '@shared/logger';
import { config } from 'dotenv';
import http from 'http';

config();

import 'reflect-metadata';
import application from './application';
import postgresDataSource from './database/config';

let _databaseConnectionOpen = false;

async function connectToDatabase(): Promise<void> {
  try {
    const dbConnection = await postgresDataSource.initialize();
    _databaseConnectionOpen = dbConnection.isInitialized;

    logger.info<string>('Database - up and running');
  } catch (error) {
    logger.error(error as Error);
    _databaseConnectionOpen = false;
  }
}

async function serverFacade(): Promise<void> {
  await connectToDatabase();

  if (_databaseConnectionOpen) {
    http.createServer(application);
  }
}

(async (): Promise<void> => {
  await serverFacade();
})();
