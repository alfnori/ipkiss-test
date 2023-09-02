import { Account } from "@common/types/account";

export default interface ITruthStoreProvider {
  wipe(): Promise<void>;
  retrive(identifier: string): Promise<Account>;
}
