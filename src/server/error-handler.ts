import {
  FastifyError,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";

import { errorResponse } from "common/utils/response";
import logger from "@common/utils/logger";

const setupErrorHandler = (server: FastifyInstance): void => {
  server.setErrorHandler(
    async (err: FastifyError, _req: FastifyRequest, reply: FastifyReply) => {
      let statusCode = 500;
      let message = "Internal Server Error";
      let details;
      if (err.validation) {
        statusCode = 400;
        message = err.message;
        details = err.validation.map((e) => e.message).join("\\n");
      }
      const error = errorResponse(statusCode, message, details);
      logger.error({ err, error }, "Exception raised!");
      return reply.code(statusCode).send(error);
    },
  );

  server.setNotFoundHandler((_req: FastifyRequest, reply: FastifyReply) => {
    const error = errorResponse(404, "Route not found!");
    return reply.code(404).send(error);
  });
};

export default setupErrorHandler;
