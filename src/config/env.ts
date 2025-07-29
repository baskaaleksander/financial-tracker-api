import dotenv from 'dotenv';

dotenv.config();

interface Config {
  dbUrl: string;
  port: number;
  nodeEnv: string;
}

const config: Config = {
  dbUrl: process.env.DB_URL || 'mongodb://localhost:27017/financial-tracker',
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
};

export default config;
