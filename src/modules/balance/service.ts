import ITruthStoreProvider from '@common/interfaces/truthStore';
import { Account } from '@common/types/account';
import { inject, injectable } from 'tsyringe';

@injectable()
class BalanceService {
  private readonly truthStoreProvider: ITruthStoreProvider;

  constructor(
    @inject('TruthStoreProvider')
    truthStoreProvider: ITruthStoreProvider,
  ) {
    this.truthStoreProvider = truthStoreProvider;
  }

  public async getAccount(accountId: string): Promise<Account | null> {
    return await this.truthStoreProvider.retrieve(accountId);
  }
}

export default BalanceService;
