import { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { errorResponse } from 'common/utils/response';
import logger from '@common/utils/logger';
import AppError from '@common/errors/AppError';
import { trace, context, SpanStatusCode } from '@opentelemetry/api';

const setupErrorHandler = (server: FastifyInstance): void => {
  server.setErrorHandler(async (err: FastifyError, req: FastifyRequest, reply: FastifyReply) => {
    const tracer = trace.getTracer('fastify-error-handler');
    const span = tracer.startSpan('errorHandler', undefined, context.active());

    try {
      if (err instanceof AppError) {
        const responseError = (err as AppError).toResponseError();
        logger.error({ err, responseError }, 'AppError raised!');
        span.setStatus({ code: SpanStatusCode.ERROR, message: responseError.message });
        span.setAttribute('error.type', 'AppError');
        span.setAttribute('error.message', responseError.message);
        span.setAttribute('error.statusCode', responseError.statusCode);
        return reply.code(responseError.statusCode).send(responseError);
      }

      let statusCode = 500;
      let message = 'Internal Server Error';
      let details;
      if (err.validation) {
        statusCode = 400;
        message = err.message;
        details = err.validation.map((e) => e.message).join('\\n');
      }

      const error = errorResponse(statusCode, message, details);
      logger.error({ err, error }, 'Exception raised!');
      span.setStatus({ code: SpanStatusCode.ERROR, message });
      span.setAttribute('error.type', 'Exception');
      span.setAttribute('error.message', message);
      span.setAttribute('error.statusCode', statusCode);
      if (details) {
        span.setAttribute('error.details', details);
      }
      return reply.code(statusCode).send(error);
    } catch (error) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: 'Unhandled error in error handler' });
      logger.error({ error }, 'Unhandled error in error handler');
      return reply.code(500).send({ message: 'Internal Server Error' });
    } finally {
      span.end();
    }
  });

  server.setNotFoundHandler((_req: FastifyRequest, reply: FastifyReply) => {
    const error = errorResponse(404, 'Route not found!');
    return reply.code(404).send(error);
  });
};

export default setupErrorHandler;
