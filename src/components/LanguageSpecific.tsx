import React from "react";
import BrowserOnly from '@docusaurus/BrowserOnly';

type LanguageProps = {
    kt?: JSX.Element;
    ts?: JSX.Element;
    flutter?: JSX.Element;
    fallback?: JSX.Element;
};

export const walletDefaultLang = "ts";

export const LanguageSpecific: React.FC<LanguageProps> = (props) => (
        <BrowserOnly fallback={props.fallback || getToShow(props, null)}>
            {() => getToShow(props, getCookie())}
        </BrowserOnly>
    );

const getToShow = (props: LanguageProps, cookie: String) => {
    let toShow = <></>;

    if (cookie == null) {
        cookie = walletDefaultLang;
    }

    if (cookie == "kt") {
        toShow = props.kt || <></>;
    } else if (cookie == "ts") {
        toShow = props.ts || <></>;
    } else if (cookie == "dart") {
        toShow = props.flutter || <></>;
    }

    return toShow;
};

export function getCookie() {
    const name = "selected_language=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        const ind = ca[i].indexOf(name);
        if (ind != -1) {
            const val = ca[i].indexOf("=");
            return ca[i].substring(val + 1, ca[i].length);
        }
    }
    return null;
}
