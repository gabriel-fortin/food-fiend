import React, { useState } from "react";

import { Ref } from "Model";

import { BadgeMenu as VersionUI } from "./UI/BadgeMenu";


interface Props {
    // TODO
    // itemRef: Ref
}

export const Connector: React.FC<Props> = (itemRef) => {

    // TODO: connect, ...???

    // TODO: get current version from itemRef
    // TODO: get all available versions from store
    // TODO: on version selection, dispatch an action to update the item (as a food? as an ingredient?)
    
    const [current, setCurrent] = useState(4);

    const options = [0, 1, 2, 3, 4, 5].map(n => ({
        text: `v${n}`,
        onSelected: () => setCurrent(n)
    }));

    const currentSelection = options[current];

    return (
        <VersionUI
            current={currentSelection}
            options={options}
        />
    );
};
