import Pino from 'pino';
import Logger from './Logger';

// TODO: once in production, this config might throw. Pino pretty is a dev dep. only
const log = Pino({
  transport: ({
    targets: [
      {
        level: 'info',
        target: 'pino/file',
        options: {
          destination: './logs/combined.log',
          mkdir: true,
          sync: false,
        },
      },
      {
        level: 'info',
        target: 'pino-pretty',
        options: {
          translateTime: 'SYS:default',
          colorize: true,
        },
      },
    ],
  }),
  name: 'the-lab--back-end',
});

const loggerGateway: Logger = {
  error(error: Error): void {
    log.error(error);
  },
  info<T>(data: T): void {
    log.info(data);
  },
};

export default loggerGateway;
