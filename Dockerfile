FROM ubuntu:22.04 as build

LABEL maintainer="SDF Ops Team <ops@stellar.org>"

RUN mkdir -p /app
WORKDIR /app

ENV DEBIAN_FRONTEND=noninteractive
ENV INLINE_RUNTIME_CHUNK=false
RUN apt-get update && apt-get install --no-install-recommends -y gpg curl git make ca-certificates apt-transport-https && \
    curl -sSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key|gpg --dearmor >/etc/apt/trusted.gpg.d/nodesource-key.gpg && \
    echo "deb https://deb.nodesource.com/node_18.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg |gpg --dearmor >/etc/apt/trusted.gpg.d/yarnpkg.gpg && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && apt-get install -y nodejs yarn && apt-get clean

COPY . /app/

RUN yarn install
RUN yarn rpcspec:build
RUN yarn stellar-cli:build
RUN yarn build

FROM nginx:1.17

COPY --from=build /app/build/ /usr/share/nginx/html/
COPY nginx /etc/nginx/
