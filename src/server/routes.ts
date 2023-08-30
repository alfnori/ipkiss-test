import {
  FastifyError,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";

import resetRoutes from "@modules/reset/routes";
import { errorResponse } from "common/utils/response";

export const registerRoutes = (server: FastifyInstance): void => {
  server.register(resetRoutes);
  //   server.register(balanceRoutes);
  //   server.register(eventRoutes);

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
      console.error("Exception", err, error);
      return reply.code(statusCode).send(error);
    },
  );

  server.setNotFoundHandler((_req: FastifyRequest, reply: FastifyReply) => {
    const error = errorResponse(404, "Route not found!");
    return reply.code(404).send(error);
  });
};
