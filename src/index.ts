export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Check if the request is for a markdown file
    if (pathname.endsWith('.md')) {
      // Remove the .md extension
      const originalPath = pathname.slice(0, -3);

      // Create a new request to the original path with markdown header
      const newUrl = new URL(url);
      newUrl.pathname = originalPath;

      const newRequest = new Request(newUrl.toString(), {
        method: request.method,
        headers: new Headers(request.headers),
        body: request.body,
        cf: {
          ...((request as any).cf || {}),
        },
      });

      // Add the Accept: text/markdown header
      newRequest.headers.set('Accept', 'text/markdown');

      // Fetch from origin
      const response = await fetch(newRequest);

      // Return the response with appropriate headers
      const newResponse = new Response(response.body, response);
      newResponse.headers.set('Content-Type', 'text/markdown; charset=utf-8');
      newResponse.headers.set('Cache-Control', 'public, max-age=3600');

      return newResponse;
    }

    // For non-markdown requests, pass through unchanged
    return fetch(request);
  },
};
