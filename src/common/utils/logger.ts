import pino from "pino";

import { nodeEnv } from "@config/environment";

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

const logger = pino({ ...envToLogger, sync: true });

export default logger;
