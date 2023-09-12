import { FastifyInstance } from 'fastify';

import resetRoutes from '@modules/reset/routes';
import balanceRoutes from '@modules/balance/routes';
import eventRoutes from '@modules/event/routes';
import { successResponse } from '@common/utils/response';

const registerRoutes = (server: FastifyInstance): void => {
  server.get('/', (_req, reply) => {
    const payload = successResponse(200, 'OK');
    return reply.code(200).send(payload);
  });
  server.register(resetRoutes);
  server.register(balanceRoutes);
  server.register(eventRoutes);
};

export default registerRoutes;
