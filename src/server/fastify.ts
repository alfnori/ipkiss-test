import 'reflect-metadata';
import '@common/providers';

import fastify, { FastifyInstance } from 'fastify';
import helmet from '@fastify/helmet';
import compress from '@fastify/compress';

import { v4 as uuidv4 } from 'uuid';
import { loggerConfigByEnv } from '@common/utils/logger';
import registerRoutes from './routes';
import setupErrorHandler from './errorHandler';

const genReqId = (request): string => {
  const requestIdHeader = request.headers['x-request-id'];
  if (typeof requestIdHeader === 'string') {
    return requestIdHeader;
  }
  return uuidv4();
};

const configureServer = (server: FastifyInstance) => {
  server.register(helmet);
  server.register(compress);

  server.removeAllContentTypeParsers();

  server.addContentTypeParser('*', function (_request, payload, done) {
    let data = '';
    payload.on('data', (chunk) => {
      data += chunk;
    });
    payload.on('end', () => {
      let body = data;
      try {
        body = JSON.parse(data);
      } catch {}
      done(null, body);
    });
  });

  server.addHook('preValidation', function (req, _reply, done) {
    const { body, params, query, headers } = req;
    req.log.info({ body, params, query, headers }, 'payload request');
    done();
  });

  server.addHook('onSend', (request, response, _payload, done) => {
    response.header('x-request-id', genReqId(request));
    done();
  });
};

const buildServer = () => {
  const server = fastify({
    logger: loggerConfigByEnv(),
    genReqId,
  });
  configureServer(server);
  registerRoutes(server);
  setupErrorHandler(server);
  return server;
};

export default buildServer;
