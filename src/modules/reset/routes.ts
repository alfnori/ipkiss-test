import { FastifyInstance, RouteShorthandOptions, HookHandlerDoneFunction } from 'fastify';
import ResetController from './controller';

const resetController = new ResetController();

export default (server: FastifyInstance, _opts: RouteShorthandOptions, done: HookHandlerDoneFunction): void => {
  server.post('/reset', resetController.reset);
  server.post('/wipe', resetController.wipe);
  done();
};
