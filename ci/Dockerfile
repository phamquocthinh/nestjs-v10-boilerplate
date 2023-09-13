ARG WORKDIR=/opt/app
ARG NODE_VERSION=node:18-alpine3.17

FROM ${NODE_VERSION} AS base
LABEL builder=true
RUN npm i -g yarn --force
USER node

# Dependencies Stage: Copy package.json + lock file and install dependencies
FROM base as installer
ARG WORKDIR
WORKDIR ${WORKDIR}
COPY --chown=node:node . .
RUN yarn install --ignore-scripts --frozen-lockfile

# Builder Stage: Copy node_modules from dependencies and build it
FROM installer as builder
ARG WORKDIR
WORKDIR ${WORKDIR}
COPY --chown=node:node . .
RUN yarn build

# Production Stage: Copy dist from builder and start the application
FROM ${NODE_VERSION} as runner
ARG WORKDIR
WORKDIR ${WORKDIR}
COPY --chown=node:node --from=builder ${WORKDIR}/dist .
USER node

EXPOSE 3000
CMD ["node", "main.js"]
