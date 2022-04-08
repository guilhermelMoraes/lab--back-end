/* eslint-disable no-use-before-define */
import winston, { format, Logger, transports as Transports } from 'winston';
import AppLogger from '../logger';

const { ENVIRONMENT } = process.env;

const {
  printf,
  combine,
  timestamp: time,
} = format;

const messageFormat = combine(
  time({ format: '[on] DD/MM/YYYY [at] HH:mm:ss' }),
  printf(({
    level,
    message,
    timestamp,
  }) => (
    `${timestamp} [${level}]: ${message}`
  )),
);

const logger = winston.createLogger({
  format: messageFormat,
  transports: [
    new Transports.File({
      dirname: 'logs',
      filename: 'errors.log',
      level: 'error',
      format: format.json(),
    }),
    new Transports.File({
      dirname: 'logs',
      filename: 'combined.log',
      format: format.json(),
    }),
  ],
  exceptionHandlers: [
    new Transports.File({
      dirname: 'logs',
      filename: 'exceptions.log',
      format: format.json(),
    }),
  ],
});

if (ENVIRONMENT !== 'PRODUCTION') {
  const consoleLogger = new Transports.Console({
    format: messageFormat,
  });
  logger.add(consoleLogger);
}

export default class WinstonLogger implements AppLogger {
  private readonly _logger: Logger;
  private static instance: WinstonLogger;

  private constructor(winstonLogger: Logger) {
    this._logger = winstonLogger;
  }

  public error(message: string): void {
    this._logger.error(message);
  }

  public info(message: string): void {
    this._logger.info(message);
  }

  public static getInstance(): WinstonLogger {
    if (!WinstonLogger.instance) {
      WinstonLogger.instance = new WinstonLogger(logger);
    }

    return WinstonLogger.instance;
  }
}
