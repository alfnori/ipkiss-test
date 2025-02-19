# Ipkiss Test API

A Node.js API project built with Fastify and TypeScript.

## Features

- Built with Fastify framework for high performance
- Written in TypeScript with strict type checking
- Comprehensive test coverage (>80% required)
- Code quality tools including ESLint and Prettier
- Compression and security middleware
- Dependency injection using TSyringe
- Logging with Pino
- Docker support with development and production configurations
- Distributed tracing with Jaeger
- Docker logs visualization with Dozzle

---

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Docker and Docker Compose
- Git

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory. The project uses `dotenv` for environment variable management.

Required environment variables:

PORT (default: 3000) - Application port
NODE_ENV - Environment (development/production)

Additional variables:

SIMPLE_LOGGER (default: false) - Toggle simple logging format
COMPOSE_PROJECT_NAME - Name for the docker compose stack

---

## Scripts

### Development

- `npm run dev` - Start development server with hot-reload and debugger
- `npm run build` - Build the project
- `npm start` - Start production server

### Testing

- `npm test` - Run all tests
- `npm run test:unit` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:coverage` - Generate test coverage report

### Code Quality

- `npm run lint` - Run ESLint and Prettier checks
- `npm run lint:fix` - Fix ESLint and Prettier issues
- `npm run prettier` - Format code with Prettier
- `npm run prettier:check` - Check code formatting

---

## Principles for Testing

The project uses the following testing stack:

- Mocha - Test framework
- Chai - Assertion library
- Sinon - Test spies, stubs, and mocks
- NYC - Code coverage

Test coverage requirements:

- Branches: >80%
- Lines: >80%
- Functions: >80%
- Statements: >80%

## Git Hooks

The project uses Husky for Git hooks:

- Pre-commit: Runs Prettier on staged files
- Prepare-commit-msg: Interactive commit message prompt
- Pre-push: Runs all tests

---

## Dependencies

### Production

- `fastify` - Web framework
- `@fastify/compress` - Response compression
- `@fastify/helmet` - Security headers
- `dotenv` - Environment variable management
- `pino` - Logging
- `tsyringe` - Dependency injection
- `uuid` - UUID generation

### Local Development

- TypeScript and related tools
- ESLint with TypeScript support
- Prettier
- Testing libraries (Mocha, Chai, Sinon)
- Development utilities (ts-node-dev, etc.)

---

## Docker

### Development Setup

The project includes a Docker Compose configuration for development with the following services:

1. **API Service (ipkisstest-api)**
   - Development server with hot-reload
   - Volume mounting for local development
   - Configurable port mapping

2. **Dozzle (Log Viewer)**
   - Web-based Docker logs viewer
   - Available at `http://localhost:8080`

3. **Jaeger (Tracing)**
   - Distributed tracing system
   - UI available at `http://localhost:16686`
   - Supports multiple protocols (gRPC, HTTP, etc.)

To start the development environment:

```bash
docker-compose up
```

### Available Ports

- API: 3000 (default, configurable)
- Dozzle: 8080
- Jaeger:
  - 6831, 6832 (UDP) - Agent ports
  - 16686 - UI
  - 4317, 4318 - OTLP
  - 14250 - gRPC
  - 14268, 14269 - HTTP
  - 9411 - Zipkin collector

### Production Deployment

The production Dockerfile uses a multi-stage build process to create an optimized image:

1. Build stage:
   - Uses Node 22 slim image
   - Installs dependencies
   - Builds the application

2. Runtime stage:
   - Copies only necessary files
   - Configurable through environment variables
   - Optimized for production use

To build and run the production image:

```bash
# Build with build arguments
docker build \
  --build-arg PORT=8080 \
  --build-arg NODE_ENV=production \
  --build-arg SIMPLE_LOGGER=false \
  -t ipkisstest-api .

# Run with environment variables
docker run \
  -p 8080:8080 \
  -e PORT=8080 \
  -e NODE_ENV=production \
  -e SIMPLE_LOGGER=false \
  ipkisstest-api
```

Alternatively, you can use an environment file:

```bash
# Create a .env file
echo "PORT=8080
NODE_ENV=production
SIMPLE_LOGGER=false" > .env

# Run using env file
docker run \
  -p 8080:8080 \
  --env-file .env \
  ipkisstest-api
```

You can also override specific variables while using an env file:

```bash
docker run \
  -p 8080:8080 \
  --env-file .env \
  -e PORT=8888 \  # This will override PORT from .env
  ipkisstest-api
```

### Available Ports - Production

- API: 8080 (default, configurable)
