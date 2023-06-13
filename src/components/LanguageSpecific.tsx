import React from "react";
import BrowserOnly from '@docusaurus/BrowserOnly';

type LanguageProps = {
    kt: JSX.Element;
    ts: JSX.Element;
};

export const walletDefaultLang = "ts"

export const LanguageSpecific: React.FC<LanguageProps> = (props) => {
    return (
        <BrowserOnly fallback={getToShow(props, null)}>
            {() => getToShow(props, getCookie())}
        </BrowserOnly>
    );
};

const getToShow = (props: LanguageProps, cookie: String) => {
    let toShow = <></>

    if (cookie == null) {
        cookie = walletDefaultLang
    }

    if (cookie == "kt") {
        toShow = props.kt
    } else if (cookie == "ts") {
        toShow = props.ts
    }

    return toShow
}

export function getCookie() {
    let name = "selected_language=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let ind = ca[i].indexOf(name)
        if (ind != -1) {
            let val = ca[i].indexOf("=")
            return ca[i].substring(val + 1, ca[i].length);
        }
    }
    return null;
}
