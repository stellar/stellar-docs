import React from "react";
import Admonition from '@theme/Admonition';
import {LanguageButtons} from "./LanguageButtons";
import {LanguageSpecific} from "./LanguageSpecific";
import {CODE_LANGS} from "../constants";
import Translate from "@docusaurus/Translate";

type WalletGuideWarnProps = {
    WIPLangs?: String[];
};

export const WalletGuideWarn: React.FC<WalletGuideWarnProps> = (props) => {
    const langs = (props.WIPLangs || []).map(v => CODE_LANGS[v.toLowerCase()]);
    const admonition = <Admonition type="danger" title="Important">
        <Translate
            id="components.WalletGuideWarn.WorkInProgress"
            description="For the Wallets SDK, if a given programming language is incomplete, display an admonition warning the user">
            Documentation for this language is currently work in progress. Some of information may not be applicable for this language, or missing. Code samples may be incomplete.
        </Translate>
    </Admonition>;

    const kt = langs.indexOf("Kotlin") != -1 ? admonition : <></>;
    const ts = langs.indexOf("TypeScript") != -1 ?  admonition: <></>;
    const flutter = langs.indexOf("Flutter") != -1 ? admonition : <></>;

    return <LanguageSpecific kt={kt} ts={ts} flutter={flutter} fallback={<></>}/>;
};
