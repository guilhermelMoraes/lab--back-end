/* eslint-disable import/first */
import { config } from 'dotenv';

config();

import 'reflect-metadata';
import express, { Application } from 'express';
import router from './router';
import postgresDataSource from './database/config';

class ServerFacade {
  private static _databaseConnectionOpen: boolean;

  private static async connectToDatabase(): Promise<void> {
    try {
      const dbConnection = await postgresDataSource.initialize();
      this._databaseConnectionOpen = dbConnection.isInitialized;

      // TODO: implement logging strategy
      console.log('[Database] Database up and running');
    } catch (error) {
      // TODO: implement logging strategy
      console.error(error);
      this._databaseConnectionOpen = false;
    }
  }

  private static async setUpExpress(): Promise<void> {
    const application: Application = express();
    const HTTP_SERVER_PORT: string | number = process.env.HTTP_SERVER_PORT ?? 8000;

    application.use(express.json());
    application.use('/', router);

    application.listen(HTTP_SERVER_PORT, (): void => {
      // TODO: implement logging strategy
      console.log(`[Server] Server is running on port ${HTTP_SERVER_PORT}`);
    });
  }

  public static async boot(): Promise<void> {
    await this.connectToDatabase();

    if (this._databaseConnectionOpen) {
      this.setUpExpress();
    }
  }
}

(async (): Promise<void> => {
  await ServerFacade.boot();
})();
