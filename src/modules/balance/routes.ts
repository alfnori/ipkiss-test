import {
  FastifyInstance,
  RouteShorthandOptions,
  HookHandlerDoneFunction,
} from "fastify";
import BalanceController from "./controller";
import { accountIdSchema } from "./validate/account";

const balanceController = new BalanceController();

export default (
  server: FastifyInstance,
  _opts: RouteShorthandOptions,
  done: HookHandlerDoneFunction,
): void => {
  server.get(
    "/balance",
    { schema: accountIdSchema },
    balanceController.account,
  );
  done();
};
