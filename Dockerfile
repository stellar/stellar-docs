FROM ubuntu:22.04 AS build

LABEL maintainer="SDF Ops Team <ops@stellar.org>"

RUN mkdir -p /app
WORKDIR /app

ENV DEBIAN_FRONTEND=noninteractive
ENV INLINE_RUNTIME_CHUNK=false
RUN apt-get update && apt-get install --no-install-recommends -y gpg curl git make ca-certificates apt-transport-https && \
    curl -sSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key|gpg --dearmor >/etc/apt/trusted.gpg.d/nodesource-key.gpg && \
    echo "deb https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg |gpg --dearmor >/etc/apt/trusted.gpg.d/yarnpkg.gpg && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && apt-get install -y nodejs yarn && apt-get clean

COPY . /app/

RUN yarn install
RUN yarn rpcspec:build
RUN yarn stellar-cli:build
# TODO: This takes a bit of time, we should probably make sure it's only done
# for production builds
# See: https://docusaurus.io/docs/3.4.0/i18n/crowdin#automate-with-ci
RUN yarn crowdin download
RUN yarn crowdin:fix
# TODO: It's actually this part that is more time-consuming. The best way to
# speed this up is to generate the preview for only `--locale en`
RUN NODE_OPTIONS="--max-old-space-size=4096" yarn build

FROM nginx:1.17

COPY --from=build /app/build/ /usr/share/nginx/html/
COPY nginx /etc/nginx/
