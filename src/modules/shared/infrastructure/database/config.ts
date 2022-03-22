import { DataSource } from 'typeorm';
import User from '../../../user/infrastructure/database/user.entity';

const {
  POSTGRES_TYPEORM_HOST,
  POSTGRES_TYPEORM_USERNAME,
  POSTGRES_TYPEORM_PASSWORD,
  POSTGRES_TYPEORM_DATABASE,
  ENVIRONMENT,
} = process.env;

const enableLogging: boolean = ENVIRONMENT === 'DEVELOPMENT';

const postgresDataSource: DataSource = new DataSource({
  type: 'postgres',
  host: POSTGRES_TYPEORM_HOST,
  port: 5432,
  username: POSTGRES_TYPEORM_USERNAME,
  password: POSTGRES_TYPEORM_PASSWORD,
  database: POSTGRES_TYPEORM_DATABASE,
  entities: [User],
  logging: enableLogging,
});

export default postgresDataSource;
