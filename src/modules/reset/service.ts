import ITruthStoreProvider from '@common/interfaces/truthStore';
import logger from '@common/utils/logger';
import { inject, injectable } from 'tsyringe';

@injectable()
class ResetService {
  private readonly truthStoreProvider: ITruthStoreProvider;

  constructor(
    @inject('TruthStoreProvider')
    truthStoreProvider: ITruthStoreProvider,
  ) {
    this.truthStoreProvider = truthStoreProvider;
  }

  public async seed(): Promise<void> {
    await this.truthStoreProvider.seed();
    logger.info(this, 'memory seeded!');
  }

  public async wipe(): Promise<void> {
    //memory wiped
    await this.truthStoreProvider.wipe();
    logger.info(this, 'memory wiped!');
  }
}

export default ResetService;
