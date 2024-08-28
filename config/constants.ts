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
