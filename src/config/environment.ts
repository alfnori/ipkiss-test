import dotenv from 'dotenv';

export const nodeEnv = () => process.env.NODE_ENV || 'development';

const loadEnvironment = () => {
  const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';

  dotenv.config({ path: `../${envFile}` });
  const { env } = process;

  return {
    PORT: Number(env.PORT) || 3000,
  };
};

export default loadEnvironment;
