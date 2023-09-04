import { raiseAppError } from '@common/errors/raise';
import { AppErrorType } from '@common/errors/types';
import ITruthStoreProvider, { TruthStore } from '@common/interfaces/truthStore';
import { Account, EventType, Operation } from '@common/types/account';
import { OperationDTO, IntervalDTO, AccountDTO, DepositDTO, WithdrawDTO, TransferDTO } from '@common/types/dto';

export default class TruthStoreProvider implements ITruthStoreProvider {
  private store: TruthStore = {};

  wipe(): Promise<void> {
    this.store = {};
    return Promise.resolve();
  }

  list(): Promise<TruthStore> {
    return Promise.resolve(this.store);
  }

  retrieve(accountNumber: string): Promise<Account | null> {
    const account = this.getAccount(accountNumber);
    return Promise.resolve(account);
  }

  async open(accountInfo: AccountDTO, trackerId: string): Promise<Account> {
    const { accountNumber, balance } = accountInfo;
    const amount = balance || 0;
    const openEvent = this.createOperation(EventType.OPEN, { amount }, trackerId);

    const account: Account = {
      accountNumber,
      balance: amount,
      events: [openEvent],
    };

    return this.putAccount(account);
  }

  async deposit(payload: DepositDTO, trackerId: string): Promise<Operation> {
    const depositAccount = await this.retrieve(payload.destination);

    if (!depositAccount || !depositAccount.accountNumber) {
      throw raiseAppError(AppErrorType.NOTFOUND_DESTINY_ACCOUNT);
    }

    const { events, accountNumber, balance } = depositAccount;
    const depositEvent = this.createOperation(EventType.DEPOSIT, payload, trackerId);
    const newBalance = balance + payload.amount;

    this.putAccount({ accountNumber, balance: newBalance, events: [...events, depositEvent] });

    return depositEvent;
  }

  async withdraw(payload: WithdrawDTO, trackerId: string): Promise<Operation> {
    const withdrawAccount = await this.retrieve(payload.origin);

    if (!withdrawAccount || !withdrawAccount.accountNumber) {
      throw raiseAppError(AppErrorType.NOTFOUND_ORIGIN_ACCOUNT);
    }

    const { events, accountNumber, balance } = withdrawAccount;
    const newBalance = balance - payload.amount;

    if (newBalance < 0) {
      throw raiseAppError(AppErrorType.NON_SUFFICIENT_FUNDS);
    }

    const withdrawEvent = this.createOperation(EventType.WITHDRAW, payload, trackerId);
    this.putAccount({ accountNumber, balance: newBalance, events: [...events, withdrawEvent] });

    return withdrawEvent;
  }

  async transfer(payload: TransferDTO, trackerId: string): Promise<Operation> {
    const accountOrigin = await this.retrieve(payload.origin);
    if (!accountOrigin || !accountOrigin.accountNumber) {
      throw raiseAppError(AppErrorType.NOTFOUND_ORIGIN_ACCOUNT);
    }

    const accountDestination = await this.retrieve(payload.destination);
    if (!accountDestination || !accountDestination.accountNumber) {
      throw raiseAppError(AppErrorType.NOTFOUND_DESTINY_ACCOUNT);
    }

    const { amount } = payload;
    const { events: eventsOrigin, accountNumber: origin, balance: balanceOrigin } = accountOrigin;
    const newBalanceOrigin = balanceOrigin - amount;

    if (newBalanceOrigin < 0) {
      throw raiseAppError(AppErrorType.NON_SUFFICIENT_FUNDS);
    }

    const transferEvent = this.createOperation(EventType.TRANSFER, payload, trackerId);

    const { events: eventsDestinatiob, accountNumber: destination, balance: balanceDestiny } = accountDestination;
    const newBalanceDestiny = balanceDestiny - amount;

    this.putAccount({ accountNumber: origin, balance: newBalanceOrigin, events: [...eventsOrigin, transferEvent] });
    this.putAccount({ accountNumber: destination, balance: newBalanceDestiny, events: [...eventsDestinatiob, transferEvent] });

    return transferEvent;
  }

  private createOperation(type: EventType, payload: Omit<OperationDTO, 'type'>, trackerId: string): Operation {
    const event: Operation = {
      ...payload,
      type,
      date: new Date(),
      trackerId,
    };
    return event;
  }

  private getAccount(accountNumber: string): Account | null {
    return this.store[accountNumber] || null;
  }

  private putAccount(account: Account): Account {
    const { accountNumber } = account;
    this.store[accountNumber] = account;
    return account;
  }
}
