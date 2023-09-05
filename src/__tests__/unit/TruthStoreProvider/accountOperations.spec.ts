import AppError from '@common/errors/AppError';
import raiseAppError from '@common/errors/raise';
import { AppErrorType } from '@common/errors/types';
import TruthStoreProvider from '@common/providers/TruthStoreProvider';
import { Account } from '@common/types/account';
import { assert, expect } from 'chai';
import sinon from 'sinon';

describe('Unit tests for TruthStore provider - Operations', async () => {
  let sandbox: sinon.SinonSandbox;
  let retrieveStub: sinon.SinonStub;
  const truthStore = new TruthStoreProvider();

  const accounts = {
    existingA: '100',
    existingB: '300',
    notExistingC: '200',
  };

  describe('Account Operation tests', async () => {

    before(async() => {
      await truthStore.open({ accountNumber: accounts.existingA, balance: 0 }, '123');
      await truthStore.open({ accountNumber: accounts.existingB, balance: 0 }, '321');
    })

    beforeEach(async () => {
      sandbox = sinon.createSandbox();
      retrieveStub = sinon.stub(TruthStoreProvider.prototype, 'retrieve');
    });
    afterEach(() => {
      retrieveStub.restore();
      sandbox.restore();
    });

    after(async() => await truthStore.wipe())

    it('should allow deposit on existing account', async () => {
      const { existingA } = accounts
      const accountBeforeDeposit = (await truthStore.retrieve(existingA)) as Account
      assert.isNotEmpty(accountBeforeDeposit);
      assert.equal(accountBeforeDeposit.balance, 0);

      const deposit = await truthStore.deposit({ amount: 100, date: new Date(), destination: existingA }, 'deposit-1')
      assert.equal(deposit.destination, existingA)
      assert.equal(deposit.amount, 100)
      
      const accountAfterDeposit = (await truthStore.retrieve(existingA)) as Account
      const operationEvent = accountAfterDeposit.events[1]
      assert.isNotEmpty(operationEvent);
      assert.equal(operationEvent.trackerId, 'deposit-1')
      assert.equal(accountAfterDeposit.balance, 100);
    });

    it('should not allow deposit on non-existing account', async () => {
      const { notExistingC } = accounts
      const depositAccount = await truthStore.retrieve(notExistingC)
      assert.equal(depositAccount, undefined)
      
      const depositPromise = async () => await truthStore.deposit({ amount: 100, date: new Date(), destination: notExistingC }, 'deposit-2')
      const noDestinyAccountError = raiseAppError(AppErrorType.NOTFOUND_DESTINY_ACCOUNT)

      expect(depositPromise).to.throw(noDestinyAccountError)
    });

    it('should allow withdraw on existing account', async () => {});

    it('should not allow withdraw on non-existing account', async () => {});

    it('should allow transfers betwennn existing accounts', async () => {});

    it('should not allow transfer on non-existing account origin', async () => {});

    it('should not allow transfer on non-existing account destination', async () => {});
  });
});
