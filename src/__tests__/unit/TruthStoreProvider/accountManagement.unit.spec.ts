import AppError from '@common/errors/AppError';
import raiseAppError from '@common/errors/raise';
import { AppErrorType } from '@common/errors/types';
import TruthStoreProvider from '@common/providers/TruthStoreProvider';
import { assert } from 'chai';

describe('Unit tests for TruthStore provider - Account', async () => {
  const truthStore = new TruthStoreProvider();

  describe('Account Management tests', async () => {
    it('should return a empty store on begin', async () => {
      const list = await truthStore.list();
      assert.equal(JSON.stringify(list), '{}');
    });

    it('should return a empty account if no account was found', async () => {
      const account = await truthStore.retrieve('123');
      assert.isUndefined(account.accountNumber);
    });

    it('should store a new account', async () => {
      const trackerId = '123';
      const accountNumber = '123';
      const open = await truthStore.open({ accountNumber }, trackerId);
      assert.equal(open.accountNumber, accountNumber);
      assert.equal(open.balance, 0);
      assert.equal(open.events.length, 1);
      assert.equal(open.events[0].trackerId, trackerId);
    });

    it('should store a second account', async () => {
      const trackerId = '321';
      const accountNumber = '321';
      const balance = 100;
      const open = await truthStore.open({ accountNumber, balance }, trackerId);
      assert.equal(open.accountNumber, accountNumber);
      assert.equal(open.balance, 100);
      assert.equal(open.events.length, 1);
      assert.equal(open.events[0].trackerId, trackerId);
    });

    it('should return a opened account', async () => {
      const account = await truthStore.retrieve('123');
      assert.isDefined(account);
      assert.equal(account?.accountNumber, '123');
    });

    it('should had two stored accounts', async () => {
      const list = await truthStore.list();
      const keys = Object.keys(list);
      assert.equal(keys.length, 2);
      assert.equal(keys[0], '123');
      assert.equal(keys[1], '321');
    });

    it('should not accept a open for an already opened accountNumber', async () => {
      const accountNumber = '321';
      const openPromise = truthStore.open({ accountNumber, balance: 0 }, 'openend-321');
      const alreadyOpenedAccountError = raiseAppError(AppErrorType.ALREADY_OPEN_ACCOUNT);

      openPromise
        .then((_d) => assert.fail('Should not be resolved!'))
        .catch((error) => {
          const appError = error as AppError;
          assert.equal(appError.name, alreadyOpenedAccountError.name);
          assert.equal(appError.message, alreadyOpenedAccountError.message);
        });
    });

    it('should wipe accounts', async () => {
      const listBeforeWipe = await truthStore.list();
      await truthStore.wipe();
      const listAfterWipe = await truthStore.list();
      assert.equal(Object.keys(listBeforeWipe).length, 2);
      assert.equal(Object.keys(listAfterWipe).length, 0);
    });

    it('should seed accounts', async () => {
      const listBeforeWipe = await truthStore.list();
      await truthStore.seed();
      const listAfterWipe = await truthStore.list();
      assert.equal(Object.keys(listBeforeWipe).length, 0);
      assert.equal(Object.keys(listAfterWipe).length, 1);
    });
  });
});
