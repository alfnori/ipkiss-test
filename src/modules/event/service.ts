import ITruthStoreProvider from '@common/interfaces/truthStore';
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

  public async depositOperation(event: DepositOperationDTO, trackerId: string): Promise<DestinationEventDTO> {
    await this.truthStoreProvider.deposit(event, trackerId);

    const accountState = await this.truthStoreProvider.retrieve(event.destination);
    return {
      destination: {
        id: accountState.accountNumber,
        balance: accountState.balance,
      },
    };
  }
}

export default EventService;
