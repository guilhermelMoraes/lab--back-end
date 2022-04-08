import winston, { format, Logger, transports as Transports } from 'winston';

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
