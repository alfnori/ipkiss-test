import TruthStoreProvider from '@common/providers/TruthStoreProvider';
import { assert } from 'chai';
import sinon from 'sinon';

describe('Unit tests for TruthStore provider - Operations', async () => {
  let sandbox: sinon.SinonSandbox;
  let retrieveStub: sinon.SinonStub;
  const truthStore = new TruthStoreProvider();

  const accs = {
    existingA: '100',
    existingB: '300',
    notExistingC: '200',
  };

  await truthStore.open({ accountNumber: accs.existingA, balance: 0 }, '123');
  await truthStore.open({ accountNumber: accs.existingB, balance: 0 }, '321');

  describe('Account Operation tests', async () => {
    beforeEach(async () => {
      sandbox = sinon.createSandbox();
      retrieveStub = sinon.stub(TruthStoreProvider.prototype, 'retrieve');
    });
    afterEach(() => {
      retrieveStub.restore();
      sandbox.restore();
    });

    it('should allow deposit on existing account', async () => {});

    it('should not allow deposit on non-existing account', async () => {});

    it('should allow withdraw on existing account', async () => {});

    it('should not allow withdraw on non-existing account', async () => {});

    it('should allow transfers betwennn existing accounts', async () => {});

    it('should not allow transfer on non-existing account origin', async () => {});

    it('should not allow transfer on non-existing account destination', async () => {});
  });
});
