import React from "react";
import BrowserOnly from '@docusaurus/BrowserOnly';
import Kotlin from '@site/static/img/kt.png'
import Typescript from '@site/static/img/ts.png'

export const LanguageButtons = () => {
    return (
        <BrowserOnly>
            {() =>
                <div style={{gap: "0.6rem", display: "flex", marginBottom: "1rem"}}>
                    <img src={Typescript} onClick={() => setCookie("ts")}  style={{maxHeight: "1.2rem"}}/>
                    <img src={Kotlin} onClick={() => setCookie("kt")} style={{maxHeight: "1.1rem"}}/>
                </div>
            }
        </BrowserOnly>
    );
};

const setCookie = (str: String) => {
    document.cookie = "selected_language=" + str + "; SameSite=Strict; expires=Fri, 31 Dec 9999 23:59:59 GMT; Secure";
    window.location.reload();
}