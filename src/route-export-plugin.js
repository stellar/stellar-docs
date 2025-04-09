const fs = require('fs');
const path = require('path');

module.exports = function routeExportPlugin(context, options) {
  return {
    name: 'route-export-plugin',
    async postBuild({ routesPaths, outDir }) {
      // Get all routes from Docusaurus
      const routes = routesPaths.map(route => {
        // Ensure routes are relative to the site URL
        return route.startsWith('/') ? route : `/${route}`;
      });

      // Sort routes for better readability
      routes.sort();

      // Create content with one URL per line
      const content = routes.join('\n') + '\n';

      // Write to the repo root directory
      const outputPath = path.join(context.siteDir, 'routes.txt');
      fs.writeFileSync(outputPath, content);

      console.log(`✅ Exported ${routes.length} routes to ${outputPath}`);
    },
  };
};