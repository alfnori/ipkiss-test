import { assert } from 'chai';
import supertest from 'supertest';

import buildServer from '../../server/fastify';
import { FastifyInstance } from 'fastify';

const accountId = '300';
const noAccountId = '200';

describe('Integration tests for module Balance', async () => {
  let fastify: FastifyInstance;

  beforeEach(async () => {
    fastify = buildServer();
    await fastify.ready();
    await supertest(fastify.server).post(`/reset`);
  });
  afterEach(async () => {
    fastify.close();
  });

  it('should return a error when account was not provided on a GET /balance endpoint', async () => {
    const response = await supertest(fastify.server).get(`/balance?account_id=`).expect(400);
    assert.equal(response.statusCode, 400);
    assert.include(response.text, `statusCode":400,"success":false,"message":"querystring`);
  });

  it('should return a empty value when account is not found on a GET /balance endpoint', async () => {
    const response = await supertest(fastify.server).get(`/balance?account_id=${noAccountId}`).expect(404);
    assert.equal(response.statusCode, 404);
    assert.equal(response.text, '0');
  });

  it('should return a amount value when account is found on a GET /balance endpoint', async () => {
    const response = await supertest(fastify.server).get(`/balance?account_id=${accountId}`).expect(200);
    assert.equal(response.statusCode, 200);
    assert.equal(response.text, '0');
  });
});
