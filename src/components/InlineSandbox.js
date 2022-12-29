import React, { useEffect, useState } from "react";
import useScript from "@site/src/state/hooks/useScript";

export const InlineSandbox = ({ module }) => {
    const htmlUrl = `https://raw.githubusercontent.com/ElliotFriend/inline-stellar-examples/main/${module}/index.html`;
    const jsUrl = `https://raw.githubusercontent.com/ElliotFriend/inline-stellar-examples/main/${module}/index.js`;
    const [htmlCode, setHtmlCode] = useState('');
    const [jsCode, setJsCode] = useState('');

    useEffect(() => {
        (async () => {
            const htmlText = await (await fetch(htmlUrl)).text();
            const jsText = await( await fetch(jsUrl)).text();
            setHtmlCode(htmlText);
            setJsCode(jsText);
        })();
    }, []);

    const status = useScript("https://static.codepen.io/assets/embed/ei.js");
    useEffect(() => {
        if (status === 'ready') {
            window.__CPEmbed(".codepen-later");
        }
    }, [jsCode]);

    return (
        <div className="codepen-later"
            data-prefill={JSON.stringify({
                title: module,
                description: `Learn about the ${module} operation on the Stellar network.`,
                head: '<meta name="viewport" content="width=device-width, initial-scale=1">',
                tags: ["Stellar", "blockchain", "demo", module],
                stylesheets: "https://cdn.tailwindcss.com",
                scripts: [
                    "https://cdnjs.cloudflare.com/ajax/libs/stellar-sdk/10.4.1/stellar-sdk.js",
                    "https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp",
                ],
            })}
            data-height="700"
            data-editable="true"
            data-default-tab="js,result"
        >

            <pre data-lang="js"><code>{jsCode}</code></pre>
            <pre data-lang="html"><code>{htmlCode}</code></pre>
        </div>
    );
};