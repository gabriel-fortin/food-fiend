import React, { createContext, ReactElement, useContext } from "react";

import { Ref } from "Model";
import { Onion, PlantOnionGarden, useOnion } from "Onion";


interface InPortalProps {
    transport: Ref | null;
}

interface OutPortalProps {
    children: (ref: Ref | null) => ReactElement;
}

interface RefAndOnion {
    ref: Ref | null;
    onion: Onion;
}


const emptyRefAndOnion: RefAndOnion = {
    ref: null,
    onion: Onion.create(),
};

const RefAndOnionContext = createContext<RefAndOnion>(emptyRefAndOnion);


export const Provider: React.FC = ({ children }) => {
    return (
        <RefAndOnionContext.Provider value={emptyRefAndOnion}>
            {children}
        </RefAndOnionContext.Provider>
    );
};

export const InPortal: React.FC<InPortalProps> = ({ transport: transportedRef }) => {
    const onion = useOnion();
    const ctx = useContext(RefAndOnionContext);

    ctx.ref = transportedRef;
    ctx.onion = onion;

    return (null);
};

export const OutPortal: React.FC<OutPortalProps> = ({ children }) => {
    const ctx = useContext(RefAndOnionContext);

    return (
        <PlantOnionGarden onion={ctx.onion}>
            {children(ctx.ref)}
        </PlantOnionGarden>
    );
};

