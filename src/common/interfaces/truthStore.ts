import { Account, Operation } from '@common/types/account';
import { AccountDTO, DepositDTO, TransferDTO, WithdrawDTO } from '@common/types/dto/services';

export type TruthStore = Record<string, Account>;

export default interface ITruthStoreProvider {
  seed(): Promise<void>;
  wipe(): Promise<void>;
  list(): Promise<TruthStore>;
  retrieve(accountNumber: string): Promise<Account>;
  open(account: AccountDTO, trackerId: string): Promise<Account>;
  deposit(payload: DepositDTO, trackerId: string): Promise<Operation>;
  withdraw(payload: WithdrawDTO, trackerId: string): Promise<Operation>;
  transfer(payload: TransferDTO, trackerId: string): Promise<Operation>;
}
