import pino from "pino";

import { isTestEnv, nodeEnv } from "@config/environment";

const loggerConfig = {
  development: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
  production: true,
  test: false,
};

export const envToLogger = loggerConfig[nodeEnv] ?? true;

const envs = isTestEnv ? { level: "silent" } : { ...envToLogger, sync: true };
const logger = pino(envs);

export default logger;
