import { assert } from 'chai';
import supertest from 'supertest';
import sinon from 'sinon';

import buildServer from '../../server/fastify';
import { Account } from '@common/types/account';
import { FastifyInstance } from 'fastify';
import TruthStoreProvider from '@common/providers/TruthStoreProvider';

const accountId = '123';
const balance = 10;
const noAccountId = '321';

const account: Account = {
  accountNumber: '123',
  balance: 10,
  events: [],
};

describe('Integration tests for module Balance', async () => {
  let fastify: FastifyInstance;
  let sandbox: sinon.SinonSandbox;
  let truthStoreStub: sinon.SinonStub;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    truthStoreStub = sinon.stub(TruthStoreProvider.prototype, 'retrieve');
    fastify = buildServer();
    await fastify.ready();
  });
  afterEach(() => {
    truthStoreStub.restore();
    sandbox.restore();
    fastify.close();
  });

  it('should return a error when account was not provided on a GET /balance endpoint', async () => {
    const response = await supertest(fastify.server).get(`/balance?account_id=`).expect(400);
    assert.equal(response.statusCode, 400);
    assert.include(response.text, `statusCode":400,"success":false,"message":"querystring`);
  });

  it('should return a empty value when account is not found on a GET /balance endpoint', async () => {
    truthStoreStub.withArgs(noAccountId).returns({});
    const response = await supertest(fastify.server).get(`/balance?account_id=${noAccountId}`).expect(404);
    assert.equal(response.statusCode, 404);
    assert.equal(response.text, '0');
  });

  it('should return a amount value when account is found on a GET /balance endpoint', async () => {
    truthStoreStub.withArgs(accountId).returns(account);
    const response = await supertest(fastify.server).get(`/balance?account_id=${accountId}`).expect(200);
    assert.equal(response.statusCode, 200);
    assert.equal(Number(response.text), balance);
  });
});
