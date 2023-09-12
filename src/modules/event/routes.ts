import { FastifyInstance, RouteShorthandOptions, HookHandlerDoneFunction } from 'fastify';
import EventController from './controller';
import { depositSchema, withdrawSchema, transferSchema } from './validate';

const eventController = new EventController();

export default (server: FastifyInstance, _opts: RouteShorthandOptions, done: HookHandlerDoneFunction): void => {
  server.post(
    '/event',
    {
      schema: {
        body: {
          oneOf: [depositSchema, withdrawSchema, transferSchema],
        },
      },
    },
    eventController.operationFacade,
  );
  done();
};
