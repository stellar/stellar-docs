# Markdown File Extension Feature

This implementation enables raw Markdown source access on all documentation pages via the `.md` file extension.

## How It Works

### 1. Cloudflare Worker (`src/index.ts`)
- Intercepts requests ending in `.md` (e.g., `/docs/build/smart-contracts/getting-started/setup.md`)
- Removes the `.md` extension from the path
- Adds the `Accept: text/markdown` header to the request
- Proxies the request back to the origin server
- Returns the response with `Content-Type: text/markdown`

### 2. Nginx Configuration (`nginx/nginx.conf`)
- Detects the `Accept: text/markdown` header
- Serves the raw markdown source files (`.mdx` or `.md`) instead of the compiled HTML
- Markdown source files are located in `/usr/share/nginx/html/docs-source/`
- Sets appropriate `Content-Type` and `Cache-Control` headers

### 3. Docker Build (`Dockerfile`)
- Copies the markdown source files to `/usr/share/nginx/html/docs-source/` during the build process
- This makes the source files available to nginx for serving when requested

## File Paths

- Cloudflare Worker code: `src/index.ts`
- Cloudflare configuration: `wrangler.toml`
- Nginx configuration: `nginx/nginx.conf`
- Docker configuration: `Dockerfile`

## Deployment

### Cloudflare Worker
```bash
# Preview deployment
yarn worker:build

# Production deployment
yarn worker:deploy
```

### Docker Image
The Docker image build automatically includes the markdown source files. No additional steps are needed beyond the standard Docker build process.

## Example Usage

```bash
# Request rendered HTML
curl https://developers.stellar.org/docs/build/smart-contracts/getting-started/setup

# Request raw markdown source
curl https://developers.stellar.org/docs/build/smart-contracts/getting-started/setup.md
```

## Cloudflare Configuration

The worker is configured to run on:
- Production: `developers.stellar.org/*` (zone: `stellar.org`)

Make sure to:
1. Have the `wrangler` CLI configured with proper authentication
2. Update the zone_name in `wrangler.toml` if using a different domain
3. Configure environment secrets if needed for the worker
