import dotenv from "dotenv";

const isTest = process.env.NODE_ENV == "test";
const envFile = isTest ? ".env.test" : ".env";

dotenv.config({ path: `../${envFile}` });
const { env } = process;

const environment = {
  PORT: Number(env.PORT) || 3000,
};

export default environment;
