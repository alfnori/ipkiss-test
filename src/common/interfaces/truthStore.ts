import { Account } from "@common/types/account";

export default interface ITruthStoreProvider {
  wipe(): Promise<void>;
  retrieve(identifier: string): Promise<Account>;
}
