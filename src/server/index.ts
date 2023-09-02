import loadEnvironment from "@config/environment";
import logger from "@common/utils/logger";

import buildServer from "./fastify";

const server = buildServer();
const env = loadEnvironment();

server.listen({ port: env.PORT, host: "0.0.0.0" }, (err) => {
  if (err) {
    logger.error(err, "Server exception!");
    process.exit(1);
  }
  logger.info(`Server started!`);
});
