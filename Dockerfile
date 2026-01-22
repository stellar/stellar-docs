FROM ubuntu:24.04 AS build

LABEL maintainer="SDF Ops Team <ops@stellar.org>"

WORKDIR /app

ENV DEBIAN_FRONTEND=noninteractive
ENV INLINE_RUNTIME_CHUNK=false
RUN apt-get update && apt-get install --no-install-recommends -y gpg curl git make ca-certificates apt-transport-https && \
    curl -sSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key|gpg --dearmor >/etc/apt/trusted.gpg.d/nodesource-key.gpg && \
    echo "deb https://deb.nodesource.com/node_22.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg |gpg --dearmor >/etc/apt/trusted.gpg.d/yarnpkg.gpg && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && apt-get install -y nodejs yarn && apt-get clean

COPY . /app/
ARG BUILD_TRANSLATIONS="False"

RUN yarn cache clean --all
RUN yarn install --frozen-lockfile
RUN du -sh /app/*
RUN yarn rpcspec:build --no-minify
RUN yarn stellar-cli:build --no-minify --cli-ref=main
RUN yarn stellar-cli:fix-links

ENV NODE_OPTIONS="--max-old-space-size=4096"
# RUN if [ "$BUILD_TRANSLATIONS" = "True" ]; then \
#     yarn docusaurus build --no-minify; \
#   else \
#     # In the preview build, we only want to build for English. Much quicker
#     yarn build --no-minify; \
#   fi
RUN yarn build --no-minify

FROM nginx:1.29

COPY --from=build /app/build/ /usr/share/nginx/html/
COPY nginx /etc/nginx/
