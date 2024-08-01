import fs from 'fs';
import path from 'path';
import glob from 'glob';
import yaml from 'js-yaml';

// Define the list of language codes
const languages = ['es'];

/**
 * Reads and parses the crowdin.yml file.
 * @param {string} filePath - The path to the crowdin.yml file.
 * @returns {Object} - The parsed configuration object.
 */
function readCrowdinConfig(filePath) {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return yaml.load(fileContent);
    } catch (err) {
        logMessage(`Error reading or parsing the file ${filePath}: ${err.message}`);
        process.exit(1);
    }
}

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
 * Replaces placeholders in the translation path with actual values.
 * @param {string} translationPath - The translation path template.
 * @param {string} languageCode - The language code to replace placeholders.
 * @param {string} srcPath - The source file path.
 * @returns {string} - The translation path with placeholders replaced.
 */
function getTranslationPath(translationPath, languageCode, srcPath) {
    const sources = ['meeting-notes', 'platforms', 'docs', 'src/pages'];
    let relativePath = srcPath;

    for (const source of sources) {
        if (srcPath.startsWith(source)) {
            relativePath = srcPath.replace(`${source}/`, '');
            break;
        }
    }

    const destPath = translationPath
        .replace('%two_letters_code%', languageCode)
        .replace('%original_file_name%', path.basename(srcPath))
        .replace('**', path.dirname(relativePath).replace(/\\/g, '/'));

    return path.join(process.cwd(), destPath);
}

/**
 * Copies ignored files for each language based on the configuration.
 */
function copyIgnoredFilesForLanguages(config) {
    config.files.forEach(({ source, translation, ignore = [] }) => {
        ignore.forEach(ignorePattern => {
            const srcPattern = ignorePattern.replace(/^\//, ''); // Strip the leading slash for the source path

            glob(srcPattern, (err, files) => {
                if (err) {
                    logMessage(`Error processing pattern ${srcPattern}: ${err.message}`);
                    return;
                }

                files.forEach(srcPath => {
                    languages.forEach(languageCode => {
                        const destPath = getTranslationPath(translation, languageCode, srcPath);
                        copyFileOrDirectory(srcPath, destPath);
                    });
                });
            });
        });
    });
}

/**
 * Main function to execute the workflow.
 */
function main() {
    const config = readCrowdinConfig('crowdin.yml');
    copyIgnoredFilesForLanguages(config);
    logMessage('Ignored files copied for all specified languages.');
}

// Execute the main function
main();
