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

const GOOGLE_TRANSLATE_LANGUAGES: string = "af,sq,am,en,fa,ar,ps,ja,zh-CN,hy,az,eu,be,bn,bs,bg,ca,ceb,ny,zh-TW,co,hr,cs,da,nl,eo,et,tl,fi,fr,fy,gl,ka,de,el,gu,ht,ha,haw,iw,hi,hmn,hu,is,ig,id,ga,it,jw,kn,kk,km,ko,ku,ky,lo,la,lv,lt,lb,mk,mg,ms,ml,mt,mi,mr,mn,my,ne,no,pl,pt,pa,ro,ru,sm,gd,sr,st,sn,sd,si,sk,sl,so,es,su,sw,sv,tg,ta,te,th,tr,uk,ur,uz,vi,cy,xh,yi,yo,zu";
export const GOOGLE_TRANSLATE_ELEMENT: string = `<a href="#" class="my-google-translate-button" onclick="new google.translate.TranslateElement({pageLanguage: 'en', includedLanguages: '${GOOGLE_TRANSLATE_LANGUAGES}'}, 'google_translate_element'); return false;"></a>`;
