import React from "react";
import BrowserOnly from '@docusaurus/BrowserOnly';
import {useColorMode} from '@docusaurus/theme-common';
import Kotlin from '@site/static/img/docusaurus/kt.png';
import KotlinDark from '@site/static/img/docusaurus/kt-dark.png';
import Typescript from '@site/static/img/docusaurus/ts.png';
import Flutter from '@site/static/img/docusaurus/flutter.png';
import FlutterDark from '@site/static/img/docusaurus/flutter-dark.png';

export const LanguageButtons = () => {
    const {colorMode} = useColorMode();
    const isDark = colorMode === 'dark';

    return (
        <BrowserOnly>
            {() =>
                <div style={{gap: "1rem", display: "flex", marginBottom: "1rem"}}>
                    <img src={Typescript} onClick={() => setCookie("ts")}  style={{maxHeight: "1.2rem", cursor: "pointer"}}/>
                    <img src={isDark ? KotlinDark : Kotlin} onClick={() => setCookie("kt")} style={{maxHeight: "1.1rem", cursor: "pointer"}}/>
                    <img src={isDark ? FlutterDark : Flutter} onClick={() => setCookie("dart")} style={{maxHeight: "1.2rem", cursor: "pointer"}}/>
                </div>
            }
        </BrowserOnly>
    );
};

const setCookie = (str: String) => {
    document.cookie = `selected_language=${  str  }; SameSite=Strict; expires=Fri, 31 Dec 9999 23:59:59 GMT; Secure`;
    window.location.reload();
};