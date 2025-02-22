# Stage 1: Build stage
FROM node:22-slim AS build
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy the rest of the application code
COPY . .

# Stage 2: Runtime stage
FROM node:22-slim
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/ ./


# Set environment variables
ARG PORT
ARG NODE_ENV
ARG SIMPLE_LOGGER
ARG TRACE_URL

ENV PORT=${PORT}
ENV NODE_ENV=${NODE_ENV}
ENV SIMPLE_LOGGER=${SIMPLE_LOGGER}
ENV TRACE_URL=${TRACE_URL}

ENV OTEL_TRACES_EXPORTER="otlp"
ENV OTEL_NODE_RESOURCE_DETECTORS="env,host,os"

# Expose the application port
EXPOSE ${PORT}

# Command to run the application
USER node
CMD [ "node", "dist/server/index.js" ]