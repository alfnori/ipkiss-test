import "reflect-metadata";
import "@common/providers";

import env from "@config/environment";
import logger from "@common/utils/logger";

import buildServer from "./fastify";
import registerRoutes from "./routes";

const server = buildServer();

registerRoutes(server);

server.listen({ port: env.PORT, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    logger.error(err, "Server exception!");
    process.exit(1);
  }
  logger.info(`Server started!`);
});
