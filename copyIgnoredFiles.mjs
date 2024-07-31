import fs from 'fs';
import path from 'path';
import glob from 'glob';

// Define the list of language codes
const languages = ['es'];

// Define the ignored files path (as per crowdin.yml configuration)
const ignoredPaths = [
    '/docs/data/horizon/api-reference/resources/**/*',
    '/docs/data/horizon/api-reference/errors/**/*',
    '/docs/**/*.api.mdx',
    '/docs/**/*.json',
    '/platforms/anchor-platform/api-reference/resources/**/*',
    '/platforms/**/*.api.mdx',
    '/platforms/**/*.json'
];

/**
 * Logs a message to the console with a timestamp.
 * @param {string} message - The message to log.
 */
function logMessage(message) {
    console.log(`[${new Date().toISOString()}] ${message}`);
}

/**
 * Copies a file or directory from source to destination.
 * @param {string} src - The source path.
 * @param {string} dest - The destination path.
 */
function copyFileOrDirectory(src, dest) {
    const destDir = path.dirname(dest);
    fs.mkdirSync(destDir, { recursive: true });

    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
        fs.cpSync(src, dest, { recursive: true });
        logMessage(`Successfully copied directory ${src} to ${dest}`);
    } else {
        fs.copyFileSync(src, dest);
        logMessage(`Successfully copied file ${src} to ${dest}`);
    }
}

/**
 * Copies ignored files for each language based on the patterns.
 */
function copyIgnoredFilesForLanguages() {
    ignoredPaths.forEach(ignoredPattern => {
        // Strip the leading slash for the source path
        const srcPattern = ignoredPattern.replace(/^\//, '');

        glob(srcPattern, (err, files) => {
            if (err) {
                logMessage(`Error processing pattern ${srcPattern}: ${err.message}`);
                return;
            }

            files.forEach(srcPath => {
                languages.forEach(languageCode => {
                    const destPath = srcPath
                        .replace(/^docs/, `i18n/${languageCode}/docusaurus-plugin-content-docs/current`)
                        .replace(/^platforms/, `i18n/${languageCode}/docusaurus-plugin-content-docs-platforms/current`);

                    copyFileOrDirectory(srcPath, destPath);
                });
            });
        });
    });
}

/**
 * Main function to execute the workflow.
 */
function main() {
    copyIgnoredFilesForLanguages();
    logMessage('Ignored files copied for all specified languages.');
}

// Execute the main function
main();
