import { FastifyInstance } from "fastify";

import resetRoutes from "@modules/reset/routes";
import balanceRoutes from "@modules/balance/routes";

const registerRoutes = (server: FastifyInstance): void => {
  server.register(resetRoutes);
  server.register(balanceRoutes);
  //   server.register(eventRoutes);
};

export default registerRoutes;
