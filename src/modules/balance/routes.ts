import {
  FastifyInstance,
  RouteShorthandOptions,
  HookHandlerDoneFunction,
} from "fastify";
import BalanceController from "./controller";

const balanceController = new BalanceController();

export default (
  server: FastifyInstance,
  _opts: RouteShorthandOptions,
  done: HookHandlerDoneFunction,
): void => {
  server.get("/balance", balanceController.account);
  done();
};
