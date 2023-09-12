import ITruthStoreProvider from '@common/interfaces/truthStore';
import { Account } from '@common/types/account';
import { DepositOperationDTO, DestinationEventDTO } from '@common/types/dto/controllers';
import { inject, injectable } from 'tsyringe';

@injectable()
class EventService {
  private readonly truthStoreProvider: ITruthStoreProvider;

  constructor(
    @inject('TruthStoreProvider')
    truthStoreProvider: ITruthStoreProvider,
  ) {
    this.truthStoreProvider = truthStoreProvider;
  }

  public async getState(accountId: string): Promise<Account> {
    return await this.truthStoreProvider.retrieve(accountId);
  }

  public async depositOperation(deposit: DepositOperationDTO): Promise<DestinationEventDTO> {
    throw new Error('Invalid Method');
  }
}

export default EventService;
