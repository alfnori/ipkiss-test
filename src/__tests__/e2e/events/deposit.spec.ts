import { assert } from 'chai';
import supertest from 'supertest';

import buildServer from '../../../server/fastify';
import { FastifyInstance } from 'fastify';
import { EventType } from '@common/types/account';

describe('Integration tests for module Event - Deposit', async () => {
  let fastify: FastifyInstance;
  const existingAccount = '300';

  beforeEach(async () => {
    fastify = buildServer();
    await fastify.ready();
  });
  afterEach(async () => {
    fastify.close();
  });

  describe('Validation Scenarios for Deposit', async () => {
    it('should return a error when no payload was provided on a POST /event endpoint', async () => {
      const response = await supertest(fastify.server).post('/event').expect(400);
      assert.equal(response.statusCode, 400);
      assert.include(response.text, `statusCode":400,"success":false,"message":"body`);
    });

    it('should return a error when type provided was invalid on a POST /event endpoint', async () => {
      const payload = { type: 'PIX', amount: 10, destination: '100' };
      const response = await supertest(fastify.server).post('/event').send(payload).expect(400);
      assert.equal(response.statusCode, 400);
      assert.include(response.text, `statusCode":400,"success":false,"message":"body`);
    });

    it('should return a error when destination was invalid on a POST /event endpoint', async () => {
      const payload = { type: EventType.DEPOSIT, amount: 10, destination: '' };
      const response = await supertest(fastify.server).post('/event').send(payload).expect(400);
      assert.equal(response.statusCode, 400);
      assert.include(response.text, `statusCode":400,"success":false,"message":"body`);
    });

    it('should return a error when amount was invalid on a POST /event endpoint', async () => {
      const payload = { type: EventType.DEPOSIT, amount: '100za', destination: '100' };
      const response = await supertest(fastify.server).post('/event').send(payload).expect(400);
      assert.equal(response.statusCode, 400);
      assert.include(response.text, `statusCode":400,"success":false,"message":"body`);
    });
  });

  describe('Operation Scenarios for Deposit', async () => {
    beforeEach(async () => {
      await supertest(fastify.server).post(`/reset`);
    });

    it('should create an account on first depoist on a POST /event endpoint', async () => {
      const payload = { type: EventType.DEPOSIT, amount: 10, destination: '100' };
      const response = await supertest(fastify.server).post('/event').send(payload).expect(201);
      assert.equal(response.statusCode, 201);
      assert.equal(response.text, '{"destination":{"id":"100","balance":10}}');
    });

    it('should return the new account balance after deposit on a POST /event endpoint', async () => {
      const payload = { type: EventType.DEPOSIT, amount: 10, destination: existingAccount };
      const response = await supertest(fastify.server).post('/event').send(payload).expect(201);
      assert.equal(response.statusCode, 201);
      assert.equal(response.text, '{"destination":{"id":"300","balance":10}}');
    });
  });
});
