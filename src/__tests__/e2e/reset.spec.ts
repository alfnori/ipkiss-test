import t from "tap";
import supertest from "supertest";

import buildServer from "../../server/fastify";

let fastify;

t.test("Integration tests for module Reset", async (t) => {
  t.beforeEach(async () => {
    fastify = buildServer();
    await fastify.ready();
  });
  t.teardown(() => fastify.close());

  t.test("It should return a error on a GET /reset endpoint", async (t) => {
    const response = await supertest(fastify.server).get("/reset").expect(404);
    t.equal(response.statusCode, 404);
    t.equal(
      response.text,
      '{"statusCode":404,"success":false,"message":"Route not found!"}',
    );
  });

  t.test("It should return a OK on a POST /reset endpoint", async (t) => {
    const response = await supertest(fastify.server).post("/reset").expect(200);
    t.equal(response.statusCode, 200);
    t.equal(response.text, "OK");
  });
});
