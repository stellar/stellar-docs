export const DEFAULT_LOCALE: string = 'en';
export const LOCALE_FULL_CODE: Record<string, string> = {
  es: 'es-ES',
};

export const makeEditUrl = ({ locale, versionDocsDirPath, docPath }) => {
  if (locale !== DEFAULT_LOCALE) {
    return `https://crowdin.com/project/stellar-dev-docs/${LOCALE_FULL_CODE[locale]}`
  }
  return `https://github.com/stellar/stellar-docs/edit/main/${versionDocsDirPath}/${docPath}`
};

export const CODE_LANGS = {
  bash: 'bash',
  cpp: 'C++',
  curl: 'cURL',
  dart: 'Flutter',
  flutter: 'Flutter',
  swift: 'Swift',
  docker: 'Dockerfile',
  go: 'Go',
  html: 'html',
  kotlin: 'Kotlin',
  kt: 'Kotlin',
  java: 'Java',
  javascript: 'JavaScript',
  js: 'JavaScript',
  json: 'JSON',
  json5: 'JSON5',
  python: 'Python',
  scss: 'SCSS',
  sql: 'SQL',
  rust: 'Rust',
  php: 'PHP',
  toml: 'TOML',
  ts: 'TypeScript',
  tsx: 'TSX',
  typescript: 'TypeScript',
  yaml: 'YAML',
};
