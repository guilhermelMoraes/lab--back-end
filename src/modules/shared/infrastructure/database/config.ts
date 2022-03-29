import { DataSource } from 'typeorm';
import User from '../../../user/infrastructure/database/user.model';

const {
  POSTGRES_TYPEORM_HOST,
  POSTGRES_TYPEORM_USERNAME,
  POSTGRES_TYPEORM_PASSWORD,
  POSTGRES_TYPEORM_DATABASE,
  ENVIRONMENT,
} = process.env;

const IS_DEVELOPMENT = ENVIRONMENT === 'DEVELOPMENT';

const postgresDataSource = new DataSource({
  type: 'postgres',
  host: POSTGRES_TYPEORM_HOST,
  username: POSTGRES_TYPEORM_USERNAME,
  password: POSTGRES_TYPEORM_PASSWORD,
  database: POSTGRES_TYPEORM_DATABASE,
  entities: [User],
  synchronize: IS_DEVELOPMENT,
});

export default postgresDataSource;
