import logger from '@common/utils/logger';
import loadEnvironment from '@config/environment';

import { type FastifyReply, type FastifyRequest } from 'fastify';
import buildServer from 'server/fastify';

loadEnvironment();
logger.info(`Serverless started!`);

const fastify = buildServer();

export default async function handler(req: FastifyRequest, res: FastifyReply) {
  await fastify.ready();
  fastify.server.emit('request', req, res);
}
