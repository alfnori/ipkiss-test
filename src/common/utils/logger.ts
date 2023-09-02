import pino from "pino";

import { nodeEnv } from "@config/environment";

export const loggerConfigByEnv = () => {
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
    test: { level: "silent" },
    homologation: { level: "debug" },
    production: true,
  };
  return loggerConfig[nodeEnv()] ?? true;
};

const envs = loggerConfigByEnv();
const logger = pino(envs);

export default logger;
