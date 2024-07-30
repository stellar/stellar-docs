import fs from 'fs';
import path from 'path';

// Define the list of language codes
const languages = ['es'];

// Define the ignored files path (as per crowdin.yml configuration)
const ignoredPaths = ['/docs/data/horizon/api-reference/resources/**/*', '/docs/data/horizon/api-reference/errors/**/*'];

// Function to copy files recursively
function copyFilesRecursively(src, dest) {
    if (!fs.existsSync(src)) {
        console.log(`Source directory ${src} does not exist.`);
        return;
    }

    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyFilesRecursively(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Function to copy ignored files for each language
function copyIgnoredFilesForLanguages() {
    ignoredPaths.forEach(ignoredPath => {
        // Strip the leading and trailing slashes and wildcard for the source path
        const srcPath = ignoredPath.replace('/**/*', '').replace(/^\//, '');

        languages.forEach(languageCode => {
            const destPath = ignoredPath
                .replace('/docs', `i18n/${languageCode}/docusaurus-plugin-content-docs/current`)
                .replace('/**/*', '')
                .replace(/^\//, '');

            copyFilesRecursively(srcPath, destPath);
            console.log(`Copied ignored files from ${srcPath} to ${destPath}`);
        });
    });
}

// Main function to execute the workflow
function main() {
    copyIgnoredFilesForLanguages();
    console.log('Ignored files copied for all specified languages.');
}

// Execute the main function
main();
