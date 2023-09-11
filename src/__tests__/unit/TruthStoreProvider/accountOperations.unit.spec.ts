import AppError from '@common/errors/AppError';
import raiseAppError from '@common/errors/raise';
import { AppErrorType } from '@common/errors/types';
import TruthStoreProvider from '@common/providers/TruthStoreProvider';
import { Account, EventType } from '@common/types/account';
import { assert, expect } from 'chai';
import { error } from 'console';
import sinon from 'sinon';

describe('Unit tests for TruthStore provider - Operations', async () => {
  let sandbox: sinon.SinonSandbox;
  const truthStore = new TruthStoreProvider();

  const accounts = {
    existingA: '100',
    existingB: '300',
    notExistingC: '200',
  };

  describe('Account Operation tests', async () => {
    before(async () => {
      await truthStore.wipe();
      await truthStore.open({ accountNumber: accounts.existingA, balance: 0 }, '123');
      await truthStore.open({ accountNumber: accounts.existingB, balance: 0 }, '321');
    });

    beforeEach(async () => {
      sandbox = sinon.createSandbox();
    });
    afterEach(() => {
      sandbox.restore();
    });

    after(async () => await truthStore.wipe());

    it('should allow deposit on existing account', async () => {
      const { existingA } = accounts;
      const accountBeforeDeposit = await truthStore.retrieve(existingA);
      assert.equal(accountBeforeDeposit.accountNumber, existingA);
      assert.equal(accountBeforeDeposit.balance, 0);

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
      const { notExistingC } = accounts;
      const depositAccount = await truthStore.retrieve(notExistingC);
      assert.equal(depositAccount.accountNumber, undefined);

      const depositPromise = truthStore.deposit({ amount: 100, date: new Date(), destination: notExistingC }, 'deposit-2');
      const noDestinyAccountError = raiseAppError(AppErrorType.NOTFOUND_DESTINY_ACCOUNT);

      depositPromise
        .then((_d) => assert.fail('Should not be resolved!'))
        .catch((error) => {
          const appError = error as AppError;
          assert.equal(appError.name, noDestinyAccountError.name);
          assert.equal(appError.message, noDestinyAccountError.message);
        });
    });

    it('should not allow deposit with negative amounts to a account', async () => {
      const { existingB } = accounts;
      const depositAccount = await truthStore.retrieve(existingB);
      assert.equal(depositAccount.accountNumber, existingB);
      assert.equal(depositAccount.balance, 0);

      const depositPromise = truthStore.deposit({ amount: -100, date: new Date(), destination: existingB }, 'withdraw-b-1');
      const noInvalidAmountAccountError = raiseAppError(AppErrorType.INVALID_AMOUNT);

      depositPromise
        .then((_d) => assert.fail('Should not be resolved!'))
        .catch((error) => {
          const appError = error as AppError;
          assert.equal(appError.name, noInvalidAmountAccountError.name);
          assert.equal(appError.message, noInvalidAmountAccountError.message);
        });
    });

    it('should allow withdraw on existing account', async () => {
      const { existingA } = accounts;
      const accountBeforeWithdraw = await truthStore.retrieve(existingA);
      assert.equal(accountBeforeWithdraw.accountNumber, existingA);
      assert.equal(accountBeforeWithdraw.balance, 100);

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
      const { notExistingC } = accounts;
      const withdrawAccount = await truthStore.retrieve(notExistingC);
      assert.equal(withdrawAccount.accountNumber, undefined);

      const withdrawPromise = truthStore.withdraw({ amount: 100, date: new Date(), origin: notExistingC }, 'withdraw-2');
      const noOriginAccountError = raiseAppError(AppErrorType.NOTFOUND_ORIGIN_ACCOUNT);

      withdrawPromise
        .then((_d) => assert.fail('Should not be resolved!'))
        .catch((error) => {
          const appError = error as AppError;
          assert.equal(appError.name, noOriginAccountError.name);
          assert.equal(appError.message, noOriginAccountError.message);
        });
    });

    it('should not allow withdraw with negative amounts from a account', async () => {
      const { existingB } = accounts;
      const withdrawAccount = await truthStore.retrieve(existingB);
      assert.equal(withdrawAccount.accountNumber, existingB);
      assert.equal(withdrawAccount.balance, 0);

      const withdrawPromise = truthStore.withdraw({ amount: -100, date: new Date(), origin: existingB }, 'withdraw-b-1');
      const noInvalidAmountAccountError = raiseAppError(AppErrorType.INVALID_AMOUNT);

      withdrawPromise
        .then((_d) => assert.fail('Should not be resolved!'))
        .catch((error) => {
          const appError = error as AppError;
          assert.equal(appError.name, noInvalidAmountAccountError.name);
          assert.equal(appError.message, noInvalidAmountAccountError.message);
        });
    });

    it('should not allow withdraw amounts > funds from a account', async () => {
      const { existingB } = accounts;
      const withdrawAccount = await truthStore.retrieve(existingB);
      assert.equal(withdrawAccount.accountNumber, existingB);
      assert.equal(withdrawAccount.balance, 0);

      const withdrawPromise = truthStore.withdraw({ amount: 100, date: new Date(), origin: existingB }, 'withdraw-b-1');
      const noFundsAccountError = raiseAppError(AppErrorType.NON_SUFFICIENT_FUNDS);

      withdrawPromise
        .then((_d) => assert.fail('Should not be resolved!'))
        .catch((error) => {
          const appError = error as AppError;
          assert.equal(appError.name, noFundsAccountError.name);
          assert.equal(appError.message, noFundsAccountError.message);
        });
    });

    it('should allow transfers betwennn existing accounts', async () => {});

    it('should not allow transfer on non-existing account origin', async () => {});

    it('should not allow transfer on non-existing account destination', async () => {});
  });
});
