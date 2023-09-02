import { assert } from "chai";
import supertest from "supertest";

import buildServer from "../../server/fastify";

let fastify;

describe("Integration tests for module Reset", ( )=> {
  beforeEach(async () => {
    fastify = buildServer();
    await fastify.ready();
  });
  afterEach(() => fastify.close());

  it("should return a error on a GET /reset endpoint", async () => {
    const response = await supertest(fastify.server).get("/reset").expect(404);
    assert.equal(response.statusCode, 404);
    assert.equal(
      response.text,
      '{"statusCode":404,"success":false,"message":"Route not found!"}',
    );
  });

  it("should return a OK on a POST /reset endpoint", async () => {
    const response = await supertest(fastify.server).post("/reset").expect(200);
    assert.equal(response.statusCode, 200);
    assert.equal(response.text, "OK");
  });
});
