import dotenv from 'dotenv';

export const nodeEnv = () => process.env.NODE_ENV || 'development';
export const useSimpleLogger = () => process.env.SIMPLE_LOGGER === 'true';

const loadEnvironment = () => {
  const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';

  dotenv.config({ path: `../${envFile}` });
  const { env } = process;

  return {
    PORT: Number(env.PORT) || 3000,
    NODE_ENV: env.NODE_ENV || 'development',
    SIMPLE_LOGGER: env.SIMPLE_LOGGER === 'true',
  };
};

export default loadEnvironment;
