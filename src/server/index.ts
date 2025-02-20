import tracing from './tracing';

import loadEnvironment from '@config/environment';
import logger from '@common/utils/logger';

import buildServer from './fastify';

async function bootstrap() {
  const otelSDK = tracing();
  await otelSDK.start();

  const env = loadEnvironment();
  const server = buildServer();

  server.listen({ port: env.PORT, host: '0.0.0.0' }, (err) => {
    if (err) {
      logger.error(err, 'Server exception!');
      process.exit(1);
    }
    logger.info(`Server started!`);
  });
}

bootstrap();
