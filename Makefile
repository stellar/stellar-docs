# Check if we need to prepend docker commands with sudo
SUDO := $(shell docker version >/dev/null 2>&1 || echo "sudo")

# If LABEL is not provided set default value
LABEL ?= $(shell git rev-parse --short HEAD)$(and $(shell git status -s),-dirty-$(shell id -u -n))
# If TAG is not provided set default value
TAG ?= stellar/stellar-docs:$(LABEL)
# https://github.com/opencontainers/image-spec/blob/master/annotations.md
BUILD_DATE := $(shell date -u +%FT%TZ)
# If we're not in production, don't build translations
BUILD_TRANSLATIONS ?= "False"

docker-build:
	$(SUDO) docker build --no-cache --pull --label org.opencontainers.image.created="$(BUILD_DATE)" -t $(TAG) . --build-arg CROWDIN_PERSONAL_TOKEN=${CROWDIN_PERSONAL_TOKEN} --build-arg BUILD_TRANSLATIONS=${BUILD_TRANSLATIONS}

docker-push:
	$(SUDO) docker push $(TAG)
