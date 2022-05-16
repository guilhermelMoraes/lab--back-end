/* eslint-disable import/first */
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

    // TODO: implement logging strategy
    console.log('[Database] Database up and running');
  } catch (error) {
    // TODO: implement logging strategy
    console.error(error);
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
