import pino from 'pino';
import Logger from '../logger';

const log = pino();

const loggerGateway: Logger = {
  error(error: Error): void {
    log.error(error);
  },
  info<T>(data: T): void {
    log.info(data);
  },
};

export default loggerGateway;
