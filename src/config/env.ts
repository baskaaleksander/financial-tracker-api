import dotenv from 'dotenv';

dotenv.config();

interface Config {
  dbUrl: string;
  port: number;
  nodeEnv: string;
  jwtSecret: string;
  jwtSecretRefresh: string;
}

const config: Config = {
  dbUrl: process.env.DB_URL || 'mongodb://localhost:27017/financial-tracker',
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
  jwtSecretRefresh: process.env.JWT_SECRET_REFRESH || 'your_jwt_refresh_secret',
};

export default config;
