import TruthStoreProvider from '@common/providers/TruthStoreProvider';
import { assert } from 'chai';
import sinon from 'sinon';


describe('Unit tests for TruthStore provider', async () => {

  const truthStore = new TruthStoreProvider();
  let sandbox: sinon.SinonSandbox;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
  });
  afterEach(() => {
    sandbox.restore();
  });

  describe('Account Management tests',async () => {

    it('should return a empty store on begin!', async () => {
      const list = await truthStore.list()
      assert.equal(JSON.stringify(list), '{}');
    });
  
    it ('should return null if no account was found!', async () => {
      const account = await truthStore.retrieve('123')
      assert.isNull(account)
    });
  
    it('should store a new account!', async () => {
      const trackerId = '123'
      const accountNumber = '123'
      const open = await truthStore.open({ accountNumber }, trackerId)
      assert.equal(open.accountNumber, accountNumber)
      assert.equal(open.balance, 0)
      assert.equal(open.events.length, 1)
      assert.equal(open.events[0].trackerId, trackerId)
    });
  
    it('should store a second account!', async () => {
      const trackerId = '321'
      const accountNumber = '321'
      const balance = 100
      const open = await truthStore.open({ accountNumber, balance }, trackerId)
      assert.equal(open.accountNumber, accountNumber)
      assert.equal(open.balance, 100)
      assert.equal(open.events.length, 1)
      assert.equal(open.events[0].trackerId, trackerId)
    });
  
    it ('should return a opened account!', async () => {
      const account = await truthStore.retrieve('123')
      assert.isDefined(account)
      assert.equal(account?.accountNumber, '123')
    });
  
    it('should had two stored accounts', async () => {
      const list = await truthStore.list()
      const keys = Object.keys(list)
      assert.equal(keys.length, 2)
      assert.equal(keys[0], '123')
      assert.equal(keys[1], '321')
    });
  
    it('should wipe accounts', async () => {
      const listBeforeWipe = await truthStore.list()
      await truthStore.wipe()
      const listAfterWipe = await truthStore.list()
      assert.equal(Object.keys(listBeforeWipe).length, 2)
      assert.equal(Object.keys(listAfterWipe).length, 0)
    });
  })

});
