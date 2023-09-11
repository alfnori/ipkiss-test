import AppError from '@common/errors/AppError';
import raiseAppError from '@common/errors/raise';
import { AppErrorType } from '@common/errors/types';
import TruthStoreProvider from '@common/providers/TruthStoreProvider';
import { Account, EventType } from '@common/types/account';
import { assert } from 'chai';
import sinon from 'sinon';

describe('Unit tests for TruthStore provider - Operations', async () => {
  let sandbox: sinon.SinonSandbox;
  const truthStore = new TruthStoreProvider();

  const existingA = '100';
  const existingB = '300';
  const notExistingC = '200';

  /**
   * Assert helper that ensures the existence from a account, returning its contents
   *
   * @param accountNumber The account numbedr from the account
   * @param actualBalance The value of balance from the account
   * @returns The account retrieved
   */
  const assertAccountPresence = async (accountNumber: string, actualBalance: number): Promise<Account> => {
    const account = await truthStore.retrieve(accountNumber);
    assert.equal(account.accountNumber, accountNumber);
    assert.equal(account.balance, actualBalance);
    return account;
  };

  /**
   * Assert helper that ensures the promise throwed an appError
   *
   * @param promise A promise to assert if it throws an error
   * @param appError The AppError to match promise throwed erro
   */
  const assertPromiseThrows = (promise: Promise<unknown>, appError: AppError) => {
    promise
      .then((_d) => assert.fail('Should not be resolved!'))
      .catch((error) => {
        const throwedAppError = error as AppError;
        assert.equal(throwedAppError.name, appError.name);
        assert.equal(throwedAppError.message, appError.message);
      });
  };

  describe('Account Operation tests', async () => {
    before(async () => {
      await truthStore.wipe();
      await truthStore.open({ accountNumber: existingA, balance: 0 }, '123');
      await truthStore.open({ accountNumber: existingB, balance: 0 }, '321');
    });

    beforeEach(async () => {
      sandbox = sinon.createSandbox();
    });
    afterEach(() => {
      sandbox.restore();
    });

    after(async () => await truthStore.wipe());

    describe('Deposit Operations', async () => {
      it('should allow deposit on existing account', async () => {
        await assertAccountPresence(existingA, 0);

        const deposit = await truthStore.deposit({ amount: 100, date: new Date(), destination: existingA }, 'deposit-1');
        assert.equal(deposit.type, EventType.DEPOSIT);
        assert.equal(deposit.destination, existingA);
        assert.equal(deposit.amount, 100);

        const accountAfterDeposit = (await truthStore.retrieve(existingA)) as Account;
        const operationEvent = accountAfterDeposit.events[1];
        assert.isNotEmpty(operationEvent);
        assert.equal(operationEvent.trackerId, 'deposit-1');
        assert.equal(accountAfterDeposit.balance, 100);
      });

      it('should not allow deposit on non-existing account', async () => {
        const depositAccount = await truthStore.retrieve(notExistingC);
        assert.equal(depositAccount.accountNumber, undefined);

        const depositPromise = truthStore.deposit({ amount: 100, date: new Date(), destination: notExistingC }, 'deposit-2');
        const noDestinyAccountError = raiseAppError(AppErrorType.NOTFOUND_DESTINY_ACCOUNT);

        assertPromiseThrows(depositPromise, noDestinyAccountError);
      });

      it('should not allow deposit with negative amounts to a account', async () => {
        await assertAccountPresence(existingB, 0);

        const depositPromise = truthStore.deposit({ amount: -100, date: new Date(), destination: existingB }, 'withdraw-b-1');
        const noInvalidAmountAccountError = raiseAppError(AppErrorType.INVALID_AMOUNT);

        assertPromiseThrows(depositPromise, noInvalidAmountAccountError);
      });
    });

    describe('Withdraw Operations', async () => {
      it('should allow withdraw on existing account', async () => {
        await assertAccountPresence(existingA, 100);

        const withdraw = await truthStore.withdraw({ amount: 100, date: new Date(), origin: existingA }, 'withdraw-1');
        assert.equal(withdraw.type, EventType.WITHDRAW);
        assert.equal(withdraw.origin, existingA);
        assert.equal(withdraw.amount, 100);

        const accountAfterWithdraw = (await truthStore.retrieve(existingA)) as Account;
        const operationEvent = accountAfterWithdraw.events[2];
        assert.isNotEmpty(operationEvent);
        assert.equal(operationEvent.trackerId, 'withdraw-1');
        assert.equal(accountAfterWithdraw.balance, 0);
      });

      it('should not allow withdraw on non-existing account', async () => {
        const withdrawAccount = await truthStore.retrieve(notExistingC);
        assert.equal(withdrawAccount.accountNumber, undefined);

        const withdrawPromise = truthStore.withdraw({ amount: 100, date: new Date(), origin: notExistingC }, 'withdraw-2');
        const noOriginAccountError = raiseAppError(AppErrorType.NOTFOUND_ORIGIN_ACCOUNT);

        assertPromiseThrows(withdrawPromise, noOriginAccountError);
      });

      it('should not allow withdraw with negative amounts from a account', async () => {
        await assertAccountPresence(existingB, 0);

        const withdrawPromise = truthStore.withdraw({ amount: -100, date: new Date(), origin: existingB }, 'withdraw-b-1');
        const noInvalidAmountAccountError = raiseAppError(AppErrorType.INVALID_AMOUNT);

        assertPromiseThrows(withdrawPromise, noInvalidAmountAccountError);
      });

      it('should not allow withdraw if amount > funds from a account', async () => {
        await assertAccountPresence(existingB, 0);

        const withdrawPromise = truthStore.withdraw({ amount: 100, date: new Date(), origin: existingB }, 'withdraw-b-1');
        const noFundsAccountError = raiseAppError(AppErrorType.NON_SUFFICIENT_FUNDS);

        assertPromiseThrows(withdrawPromise, noFundsAccountError);
      });
    });
    describe('Transfer Operations', async () => {
      it('should allow transfers between existing accounts', async () => {
        await assertAccountPresence(existingA, 0);
        await assertAccountPresence(existingB, 0);
        await truthStore.deposit({ amount: 100, date: new Date(), destination: existingA }, 'deposit-transfer-1');
        await assertAccountPresence(existingA, 100);

        const trackerTransferId = 'transfer-a-b-1';

        const transfer = await truthStore.transfer({ amount: 100, date: new Date(), origin: existingA, destination: existingB }, trackerTransferId);
        assert.equal(transfer.type, EventType.TRANSFER);
        assert.equal(transfer.trackerId, trackerTransferId);
        assert.equal(transfer.amount, 100);

        const transferOrigin = await assertAccountPresence(existingA, 0);
        const originLastEvent = transferOrigin.events.slice(-1).pop();
        assert.equal(originLastEvent?.trackerId, trackerTransferId);

        const transferDestination = await assertAccountPresence(existingB, 100);
        const destinationLastEvent = transferDestination.events.slice(-1).pop();
        assert.equal(destinationLastEvent?.trackerId, trackerTransferId);
      });

      it('should not allow transfer on non-existing account origin', async () => {
        const originAccount = await truthStore.retrieve(notExistingC);
        assert.equal(originAccount.accountNumber, undefined);

        const transferPromise = truthStore.transfer(
          { amount: 100, date: new Date(), origin: notExistingC, destination: existingB },
          'transfer-to-c-1',
        );
        const noOriginAccountError = raiseAppError(AppErrorType.NOTFOUND_ORIGIN_ACCOUNT);

        assertPromiseThrows(transferPromise, noOriginAccountError);
      });

      it('should not allow transfer on non-existing account destination', async () => {
        const destinationAccount = await truthStore.retrieve(notExistingC);
        assert.equal(destinationAccount.accountNumber, undefined);

        const transferPromise = truthStore.transfer(
          { amount: 100, date: new Date(), origin: existingA, destination: notExistingC },
          'transfer-to-c-2',
        );
        const noDestinationAccountError = raiseAppError(AppErrorType.NOTFOUND_DESTINY_ACCOUNT);

        assertPromiseThrows(transferPromise, noDestinationAccountError);
      });

      it('should not allow transfers with negative amounts to a account', async () => {
        const transferPromise = truthStore.transfer({ amount: -100, date: new Date(), origin: existingA, destination: existingB }, 'transfer-a-b-2');
        const noDestinationAccountError = raiseAppError(AppErrorType.INVALID_AMOUNT);

        assertPromiseThrows(transferPromise, noDestinationAccountError);
      });

      it('should not allow transfers if amount > funds from a account', async () => {
        const transferPromise = truthStore.transfer({ amount: 1000, date: new Date(), origin: existingA, destination: existingB }, 'transfer-a-b-3');
        const noDestinationAccountError = raiseAppError(AppErrorType.NON_SUFFICIENT_FUNDS);

        assertPromiseThrows(transferPromise, noDestinationAccountError);
      });
    });
  });
});
