import ITruthStoreProvider from "@common/interfaces/truthStore";
import { Account } from "@common/types/account";

export default class TruthStoreProvider implements ITruthStoreProvider {
  store = {};
  wipe(): Promise<void> {
    this.store = {};
    return Promise.resolve();
  }
  retrieve(identifier: string): Promise<Account> {
    const account = this.store[identifier] || null;
    return Promise.resolve(account);
  }
}
