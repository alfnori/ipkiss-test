import { assert } from 'chai';
import supertest from 'supertest';

import buildServer from '../../../server/fastify';
import { FastifyInstance } from 'fastify';
import { EventType } from '@common/types/account';

describe('Integration tests for module Event - Withdraw', async () => {
  let fastify: FastifyInstance;
  const existingAccount = '400';

  beforeEach(async () => {
    fastify = buildServer();
    await fastify.ready();
  });
  afterEach(async () => {
    fastify.close();
  });

  describe('Validation Scenarios for Withdraw', async () => {
    it('should return a error when no payload was provided on a POST /event endpoint', async () => {
      const response = await supertest(fastify.server).post('/event').expect(400);
      assert.equal(response.statusCode, 400);
      assert.include(response.text, `statusCode":400,"success":false,"message":"body`);
    });

    it('should return a error when type provided was invalid on a POST /event endpoint', async () => {
      const payload = { type: 'PIX', amount: 10, origin: '100' };
      const response = await supertest(fastify.server).post('/event').send(payload).expect(400);
      assert.equal(response.statusCode, 400);
      assert.include(response.text, `statusCode":400,"success":false,"message":"body`);
    });

    it('should return a error when origin was invalid on a POST /event endpoint', async () => {
      const payload = { type: EventType.WITHDRAW, amount: 10, origin: '' };
      const response = await supertest(fastify.server).post('/event').send(payload).expect(400);
      assert.equal(response.statusCode, 400);
      assert.include(response.text, `statusCode":400,"success":false,"message":"body`);
    });

    it('should return a error when amount was invalid on a POST /event endpoint', async () => {
      const payload = { type: EventType.WITHDRAW, amount: '100za', origin: '100' };
      const response = await supertest(fastify.server).post('/event').send(payload).expect(400);
      assert.equal(response.statusCode, 400);
      assert.include(response.text, `statusCode":400,"success":false,"message":"body`);
    });
  });

  describe('Operation Scenarios for Withdraw', async () => {
    beforeEach(async () => {
      await supertest(fastify.server).post(`/reset`);
      const depositPayload = { type: EventType.DEPOSIT, amount: 100, destination: existingAccount }
      await supertest(fastify.server).post(`/event`).send(depositPayload);
    });

    it('should return a statusCode 404 when origin not found on a POST /event endpoint', async () => {
      const payload = { type: EventType.WITHDRAW, amount: 10, origin: '123' };
      const response = await supertest(fastify.server).post('/event').send(payload).expect(404);
      assert.equal(response.statusCode, 404);
      assert.equal(response.text, '0');
    });

    it('should return a statusCode 404 when account had no funds on a POST /event endpoint', async () => {
      const payload = { type: EventType.WITHDRAW, amount: 100, origin: '300' };
      const response = await supertest(fastify.server).post('/event').send(payload).expect(404);
      assert.equal(response.statusCode, 404);
      assert.equal(response.text, '0');
    });

    it('should return the new account balance after withdraw on a POST /event endpoint', async () => {
      const payload = { type: EventType.WITHDRAW, amount: 10, origin: existingAccount };
      const response = await supertest(fastify.server).post('/event').send(payload).expect(201);
      assert.equal(response.statusCode, 201);
      assert.equal(response.text, '{"origin":{"id":"400","balance":90}}');
    });
  });
});
