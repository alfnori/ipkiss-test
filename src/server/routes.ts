import {
  FastifyError,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";

import resetRoutes from "@modules/reset/routes";

const registerRoutes = (server: FastifyInstance): void => {
  server.register(resetRoutes);
  //   server.register(balanceRoutes);
  //   server.register(eventRoutes);
};

export default registerRoutes;
