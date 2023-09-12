import ITruthStoreProvider from '@common/interfaces/truthStore';
import { DepositOperationDTO, DestinationEventDTO, OriginEventDTO, TransferEventDTO, TransferOperationDTO, WithdrawOperationDTO } from '@common/types/dto/controllers';
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
    const { destination, amount } = event;
    const previousAccountState = await this.truthStoreProvider.retrieve(destination);

    if (!previousAccountState.accountNumber) {
      const accountNumber = destination
      const balance = amount
      await this.truthStoreProvider.open({ accountNumber, balance }, trackerId);

      return {
        destination: {
          id: accountNumber,
          balance: balance,
        },
      };
    }

    await this.truthStoreProvider.deposit({ ...event, date: new Date() }, trackerId);
    const accountState = await this.truthStoreProvider.retrieve(destination);

    return {
      destination: {
        id: accountState.accountNumber,
        balance: accountState.balance,
      },
    };
  }

  public async withdrawOperation(event: WithdrawOperationDTO, trackerId: string): Promise<OriginEventDTO> {
    await this.truthStoreProvider.withdraw({ ...event, date: new Date() }, trackerId);
    const accountState = await this.truthStoreProvider.retrieve(event.origin);

    return {
      origin: {
        id: accountState.accountNumber,
        balance: accountState.balance,
      },
    };
  }

  public async transferOperation(event: TransferOperationDTO, trackerId: string): Promise<TransferEventDTO> {
    await this.truthStoreProvider.transfer({ ...event, date: new Date() }, trackerId);
    const originState = await this.truthStoreProvider.retrieve(event.origin);
    const destinationState = await this.truthStoreProvider.retrieve(event.destination);

    return {
      origin: {
        id: originState.accountNumber,
        balance: originState.balance,
      },
      destination: {
        id: destinationState.accountNumber,
        balance: destinationState.balance,
      },
    };
  }

}

export default EventService;
