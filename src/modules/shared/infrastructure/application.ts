/* eslint-disable import/first */
import { config } from 'dotenv';

config();

import 'reflect-metadata';
import express, { Application } from 'express';
import router from './router';
import postgresDataSource from './database/config';
import Logger from '../../../log/logger';
import WinstonLogger from '../../../log/winston/winston-logger';

class ServerFacade {
  private readonly _logger: Logger;
  private _databaseConnectionOpen!: boolean;

  constructor(logger: Logger) {
    this._logger = logger;
  }

  private async connectToDatabase(): Promise<void> {
    try {
      const dbConnection = await postgresDataSource.initialize();
      this._databaseConnectionOpen = dbConnection.isInitialized;

      this._logger.info('Database up and running');
    } catch (error) {
      this._logger.error((error as Error).message);
      this._databaseConnectionOpen = false;
    }
  }

  private async setUpExpress(): Promise<void> {
    const application: Application = express();
    const HTTP_SERVER_PORT: string | number = process.env.HTTP_SERVER_PORT ?? 8000;

    application.use(express.json());
    application.use('/', router);

    application.listen(HTTP_SERVER_PORT, (): void => {
      this._logger.info(`Server is running on port ${HTTP_SERVER_PORT}`);
    });
  }

  public async boot(): Promise<void> {
    await this.connectToDatabase();

    if (this._databaseConnectionOpen) {
      this.setUpExpress();
    }
  }
}

(async (): Promise<void> => {
  const winstonLogger = WinstonLogger.getInstance();

  const application = new ServerFacade(winstonLogger);
  await application.boot();
})();
