import ITruthStoreProvider from "@common/interfaces/truthStore";
import { inject, injectable } from "tsyringe";

@injectable()
class ResetService {
  private readonly truthStoreProvider: ITruthStoreProvider;

  constructor(
    @inject("TruthStoreProvider")
    truthStoreProvider: ITruthStoreProvider,
  ) {
    this.truthStoreProvider = truthStoreProvider;
  }

  public async reset(): Promise<void> {
    //memory wiped
    await this.truthStoreProvider.wipe();
    console.log("memory wiped!");
  }
}

export default ResetService;
