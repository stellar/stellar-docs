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

export const GOOGLE_TRANSLATE_ELEMENT = `<div id="google_translate_element" style="display:inline-block"></div><a class="navbar__link false" href="#" onclick="new google.translate.TranslateElement({pageLanguage: 'en', includedLanguages: 'af,sq,am,en,fa,ar,ps,ja,zh-CN,hy,az,eu,be,bn,bs,bg,ca,ceb,ny,zh-TW,co,hr,cs,da,nl,eo,et,tl,fi,fr,fy,gl,ka,de,el,gu,ht,ha,haw,iw,hi,hmn,hu,is,ig,id,ga,it,jw,kn,kk,km,ko,ku,ky,lo,la,lv,lt,lb,mk,mg,ms,ml,mt,mi,mr,mn,my,ne,no,pl,pt,pa,ro,ru,sm,gd,sr,st,sn,sd,si,sk,sl,so,es,su,sw,sv,tg,ta,te,th,tr,uk,ur,uz,vi,cy,xh,yi,yo,zu'}, 'google_translate_element'); return false;"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" style="vertical-align: text-bottom"><path fill="currentColor" d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"></path></svg></a>`;
