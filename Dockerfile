FROM ubuntu:26.04 AS build

LABEL maintainer="SDF Ops Team <ops@stellar.org>"

WORKDIR /app

ENV DEBIAN_FRONTEND=noninteractive
ENV INLINE_RUNTIME_CHUNK=false
RUN apt-get update && apt-get install --no-install-recommends -y gpg curl git make ca-certificates apt-transport-https && \
    curl -sSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key|gpg --dearmor >/etc/apt/trusted.gpg.d/nodesource-key.gpg && \
    echo "deb https://deb.nodesource.com/node_24.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list && \
    apt-get update && apt-get install -y nodejs libatomic1 && apt-get clean

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME/bin:$PATH"
RUN corepack enable

COPY . /app/
ARG BUILD_TRANSLATIONS="False"

RUN pnpm ci
RUN du -sh /app/*
RUN pnpm rpcspec:build --no-minify
RUN pnpm stellar-cli:build --no-minify --cli-ref=main
RUN pnpm stellar-cli:fix-links

ENV NODE_OPTIONS="--max-old-space-size=4096"
# RUN if [ "$BUILD_TRANSLATIONS" = "True" ]; then \
#     pnpm docusaurus build --no-minify; \
#   else \
#     # In the preview build, we only want to build for English. Much quicker
#     pnpm build --no-minify; \
#   fi
RUN pnpm build --no-minify

FROM nginx:1.31

COPY --from=build /app/build/ /usr/share/nginx/html/
COPY nginx /etc/nginx/
