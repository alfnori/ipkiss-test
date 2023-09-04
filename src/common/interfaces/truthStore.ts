import { Account, Operation } from '@common/types/account';
import { AccountDTO, DepositDTO, IntervalDTO, TransferDTO, WithdrawDTO } from '@common/types/dto';

export default interface ITruthStoreProvider {
  wipe(): Promise<void>;
  retrieve(accountNumber: string): Promise<Account | null>;
  events(account: AccountDTO, interval?: IntervalDTO): Promise<Operation[]>;
  open(account: AccountDTO, trackerId: string): Promise<Account>;
  deposit(payload: DepositDTO, trackerId: string): Promise<Operation>;
  withdraw(payload: WithdrawDTO, trackerId: string): Promise<Operation>;
  transfer(payload: TransferDTO, trackerId: string): Promise<Operation>;
}
