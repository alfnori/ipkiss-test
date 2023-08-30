import ITruthStoreProvider from "@common/interfaces/truthStore";

export default class TruthStoreProvider implements ITruthStoreProvider {
  store = {};
  wipe(): Promise<void> {
    this.store = {};
    return Promise.resolve();
  }
}
