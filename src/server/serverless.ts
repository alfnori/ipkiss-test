import loadEnvironment from '@config/environment';
import logger from '@common/utils/logger';

import { type FastifyReply, type FastifyRequest } from 'fastify';
import buildServer from './fastify';
import otelSDK from './tracing';

otelSDK.start();

export default async (req: FastifyRequest, res: FastifyReply) => {
  try {
    loadEnvironment();
    const fastify = buildServer();
    await fastify.ready();
    logger.info(`Serverless started!`);
    fastify.server.emit('request', req, res);
  } catch (error) {
    logger.error(error, 'Server exception!');
    res.status(500).send({ error: 'Internal Server Error' });
  }
};
