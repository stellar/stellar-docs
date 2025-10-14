###
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

# the app label is used by the pipelines to prune docker dangling images on the jenkins build hosts
docker-build:
	$(SUDO) docker build -m 8g --no-cache --pull --label app="stellar-docs" --label org.opencontainers.image.created="$(BUILD_DATE)" -t $(TAG) . --build-arg BUILD_TRANSLATIONS=${BUILD_TRANSLATIONS}

docker-push:
	$(SUDO) docker push $(TAG)
