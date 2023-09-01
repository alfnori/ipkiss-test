import "reflect-metadata";
import "@common/providers";

import fastify, { FastifyInstance } from "fastify";
import helmet from "@fastify/helmet";
import compress from "@fastify/compress";

import { v4 as uuidv4 } from "uuid";
import { envToLogger } from "@common/utils/logger";
import registerRoutes from "./routes";
import setupErrorHandler from "./error-handler";

const configureServer = (server: FastifyInstance) => {
  server.register(helmet);
  server.register(compress);

  server.removeAllContentTypeParsers();

  server.addContentTypeParser("*", function (_request, payload, done) {
    let data = "";
    payload.on("data", (chunk) => {
      data += chunk;
    });
    payload.on("end", () => {
      done(null, data);
    });
  });
};

const buildServer = () => {
  const server = fastify({
    logger: envToLogger,
    genReqId: (req) => {
      const requestIdHeader = req.headers["x-request-id"];
      if (requestIdHeader && Array.isArray(requestIdHeader)) {
        return requestIdHeader[0];
      }
      return requestIdHeader || uuidv4();
    },
  });
  configureServer(server);
  registerRoutes(server);
  setupErrorHandler(server);
  return server;
};

export default buildServer;
