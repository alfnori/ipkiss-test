import { container } from 'tsyringe';
import BalanceService from './service';
import { FastifyRequest, FastifyReply } from 'fastify';
import logger from '@common/utils/logger';

type AccountRequest = FastifyRequest<{
  Querystring: { account_id: string };
}>;

class BalanceController {
  public async account(req: AccountRequest, reply: FastifyReply): Promise<FastifyReply> {
    const accountId = req.query['account_id'];

    const service = container.resolve(BalanceService);
    const account = await service.getAccount(accountId);

    logger.info(account, `AccountInfo ${accountId}`);

    if (!account || !account.accountNumber) {
      return reply.code(404).send(0);
    }

    return reply.code(200).send(account.balance);
  }
}

export default BalanceController;
