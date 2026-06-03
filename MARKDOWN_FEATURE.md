# Markdown File Extension Feature

This implementation enables raw Markdown source access on all documentation pages via the `.md` file extension, using Cloudflare's native markdown feature.

## How It Works

### 1. Nginx Configuration (`nginx/nginx.conf`)
- When a request comes in for a path (e.g., `/docs/build/smart-contracts/getting-started/setup.md`), nginx first tries to serve it as-is
- If that fails, nginx falls back to checking for markdown source files in `/docs-source/`
- Serves the raw markdown source files (`.mdx` or `.md`) with proper `Content-Type: text/markdown` header
- Markdown source files are located in `/usr/share/nginx/html/docs-source/`

### 2. Docker Build (`Dockerfile`)
- Copies the markdown source files from `/docs/` to `/usr/share/nginx/html/docs-source/` during the build process
- This makes the source files available to nginx for serving

### 3. Cloudflare Markdown Feature
- Cloudflare automatically detects `Content-Type: text/markdown` responses
- Serves the raw markdown instead of rendering it as HTML
- See: https://blog.cloudflare.com/markdown-for-agents/

## File Paths

- Nginx configuration: `nginx/nginx.conf`
- Docker configuration: `Dockerfile`

## Example Usage

```bash
# Request rendered HTML
curl https://developers.stellar.org/docs/build/smart-contracts/getting-started/setup

# Request raw markdown source (Cloudflare serves the raw markdown)
curl https://developers.stellar.org/docs/build/smart-contracts/getting-started/setup.md
```

## Configuration

The feature works automatically once deployed:
1. Build and deploy the Docker image
2. Cloudflare will detect markdown responses and serve them appropriately
3. No additional configuration needed
