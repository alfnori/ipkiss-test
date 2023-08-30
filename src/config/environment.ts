import dotenv from "dotenv";

export const nodeEnv = process.env.NODE_ENV || "development";
export const isTestEnv = nodeEnv == "test";

const envFile = isTestEnv ? ".env.test" : ".env";

dotenv.config({ path: `../${envFile}` });
const { env } = process;

const environment = {
  PORT: Number(env.PORT) || 3000,
};

export default environment;
