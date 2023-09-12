import { assert } from 'chai';
import sinon from 'sinon';
import supertest from 'supertest';

import buildServer from '../../server/fastify';
import { FastifyInstance } from 'fastify';

import TruthStoreProvider from '@common/providers/TruthStoreProvider';
import ResetController from '@modules/reset/controller';
import { HttpSuccessResponse } from '@common/types/http';

import * as loggers from '@common/utils/logger';
import loadEnvironment, { nodeEnv } from '@config/environment';
import raiseAppError from '@common/errors/raise';
import { AppErrorType } from '@common/errors/types';

describe('Integration tests for Fastify', () => {
  let fastify: FastifyInstance;
  let sandbox: sinon.SinonSandbox;
  let truthStoreStub: sinon.SinonStub;
  let controllerSpy: sinon.SinonSpy;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    truthStoreStub = sinon.stub(TruthStoreProvider.prototype, 'seed');
    controllerSpy = sinon.spy(ResetController.prototype, 'reset');
    fastify = buildServer();
    await fastify.ready();
  });
  afterEach(() => {
    truthStoreStub.restore();
    controllerSpy.restore();
    sandbox.restore();
    fastify.close();
  });

  it('should return a error if a exception was not caugth', async () => {
    truthStoreStub.throws(new Error('Uncaugth Error!'));
    const response = await supertest(fastify.server).post('/reset').expect(500);
    assert.equal(response.statusCode, 500);
    assert.equal(response.text, '{"statusCode":500,"success":false,"message":"Internal Server Error"}');
  });

  it('should return a error if a AppError exception was not caugth', async () => {
    truthStoreStub.throws(raiseAppError(AppErrorType.ALREADY_OPEN_ACCOUNT, 'Custom AppError'));
    const response = await supertest(fastify.server).post('/reset').expect(409);
    assert.equal(response.statusCode, 409);
    assert.equal(
      response.text,
      '{"statusCode":409,"success":false,"message":"The account provided was already open!\\\\nCustom AppError","details":{"error":"ALREADY_OPEN_ACCOUNT"}}',
    );
  });

  it('should return a requestId if the header was present', async () => {
    const customRequestId = 'custom-request-id';
    const response = await supertest(fastify.server).post('/').set('x-request-id', customRequestId).expect(404);
    assert.equal(response.statusCode, 404);
    assert.equal(response.headers['x-request-id'], customRequestId);
  });

  it('should recover a POST body properly if present', async () => {
    const payload = { data: 123 };
    const response = await supertest(fastify.server).post('/reset').send(payload).expect(200);
    const params = controllerSpy.getCall(0).args;
    const request = params[0] || {};
    assert.equal(response.statusCode, 200);
    assert.equal(JSON.stringify(request.body), JSON.stringify(payload));
  });

  it('should return a body properly if sent', async () => {
    const payload: HttpSuccessResponse = {
      statusCode: 200,
      success: true,
      message: 'OK',
    };
    const response = await supertest(fastify.server).get('/').expect(200);
    assert.equal(response.statusCode, 200);
    assert.equal(response.text, JSON.stringify(payload));
  });

  it('should return respect environment configurations', async () => {
    const { NODE_ENV } = process.env;
    let loggerSpy, response, env, config;

    process.env.NODE_ENV = 'homologation';
    loggerSpy = sinon.spy(loggers, 'loggerConfigByEnv');

    fastify = buildServer();
    await fastify.ready();

    response = await supertest(fastify.server).get('/').expect(200);
    assert.equal(response.statusCode, 200);
    assert.equal(JSON.stringify(loggerSpy.getCall(0).returnValue), '{"level":"debug"}');

    process.env.NODE_ENV = 'HML';
    loggerSpy.restore();
    loggerSpy = sinon.spy(loggers, 'loggerConfigByEnv');

    fastify = buildServer();
    await fastify.ready();

    response = await supertest(fastify.server).get('/').expect(200);
    assert.equal(response.statusCode, 200);
    assert.equal(JSON.stringify(loggerSpy.getCall(0).returnValue), 'true');

    process.env.NODE_ENV = '';
    process.env.PORT = '1234';

    env = nodeEnv();
    config = loadEnvironment();
    assert.equal(env, 'development');
    assert.equal(config.PORT, 1234);

    process.env.NODE_ENV = 'test';
    process.env.PORT = '';

    env = nodeEnv();
    config = loadEnvironment();
    assert.equal(env, 'test');
    assert.equal(config.PORT, 3000);

    loggerSpy.restore();
    process.env.NODE_ENV = NODE_ENV;
  });
});
