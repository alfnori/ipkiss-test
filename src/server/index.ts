import "reflect-metadata";
import "@common/providers";

import fastify from "fastify";
import helmet from "@fastify/helmet";
import compress from "@fastify/compress";
import { v4 as uuidv4 } from "uuid";

import env from "@config/environment";
import { registerRoutes } from "./routes";

const server = fastify({
  logger: true,
  genReqId: (req) => {
    const requestIdHeader = req.headers["x-request-id"];
    if (requestIdHeader && Array.isArray(requestIdHeader)) {
      return requestIdHeader[0];
    }
    return requestIdHeader || uuidv4();
  },
});

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

registerRoutes(server);

server.listen({ port: env.PORT, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
