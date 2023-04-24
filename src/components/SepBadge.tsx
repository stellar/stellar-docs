import React from "react";

type ProductProps = {
    tags: string;
};

export const SepBadge: React.FC<ProductProps> = (props) => {
    const tags = props.tags.split(",");
    const seps = tags.filter(w => w.toLowerCase().includes("sep")).sort();

    if (seps.length === 0) {
        return <></>;
    }

    return (<div style={{marginBottom: "var(--ifm-spacing-vertical)"}}>
        {seps.map((sep) => (
            <span style={{borderRadius: "var(--ifm-global-radius)", marginRight: "var(--ifm-global-spacing"}}
                  className="badge badge--primary">{sep}</span>
        ))}
    </div>);
};
