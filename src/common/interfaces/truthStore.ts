import { Account, Operation } from '@common/types/account';
import { AccountDTO, DepositDTO, IntervalDTO, TransferDTO, WithdrawDTO } from '@common/types/dto';

export type TruthStore = Record<string, Account>;

export default interface ITruthStoreProvider {
  wipe(): Promise<void>;
  list(): Promise<TruthStore>;
  retrieve(accountNumber: string): Promise<Account | null>;
  open(account: AccountDTO, trackerId: string): Promise<Account>;
  deposit(payload: DepositDTO, trackerId: string): Promise<Operation>;
  withdraw(payload: WithdrawDTO, trackerId: string): Promise<Operation>;
  transfer(payload: TransferDTO, trackerId: string): Promise<Operation>;
}
