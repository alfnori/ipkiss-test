'use strict';

import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { FastifyInstrumentation, FastifyRequestInfo } from '@opentelemetry/instrumentation-fastify';

import { Resource } from '@opentelemetry/resources';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { ClientRequest, IncomingMessage } from 'http';

const traceURL = process.env.TRACE_URL || 'http://0.0.0.0:4318/v1/traces';
const serverless = process.env.SERVERLESS === 'true';

const IGNORED_PATHS = ['/', '/api', '/health'];

// Initialize the SDK and register with the OpenTelemetry API
const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: traceURL,
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-http': {
        requestHook: (span, request: ClientRequest | IncomingMessage) => {
          const requestInfo = (request as ClientRequest).req || request;
          span.updateName(`HTTP ${requestInfo.method} ${requestInfo.url}`);
        },
        ignoreIncomingRequestHook: (request: IncomingMessage) => {
          if (request.url && IGNORED_PATHS.includes(`${request.url}`)) {
            return true;
          }
          return false;
        },
      },
    }),
    new FastifyInstrumentation({
      requestHook: function (span, info: FastifyRequestInfo) {
        span.setAttribute('http.request.id', info.request.id);
        span.setAttribute('http.route', info.request.routeOptions.url);
        span.setAttribute('http.method', info.request.method);
      },
    }),
  ],
  resource: new Resource({
    [ATTR_SERVICE_NAME]: 'ipkisstest-service',
  }),
  ...(!serverless
    ? {
        metricReader: new PeriodicExportingMetricReader({
          exporter: new OTLPMetricExporter({
            url: traceURL.replace('traces', 'metrics'),
          }),
        }),
      }
    : {}),
});

// Gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});

export default sdk;
