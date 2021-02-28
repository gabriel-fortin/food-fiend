import React, { createContext, ReactElement, useContext, useState } from "react";

import { Ref } from "Model";
import { eqOnion, Onion, PlantOnionGarden, useOnion } from "Onion";
import { eqRef } from "tools";


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

interface Update {
    update: (rao: RefAndOnion) => void;
}


const emptyRAO: RefAndOnion = {
    ref: null,
    onion: Onion.create(),
};
const dummyUpdater: Update = {
    update: (rao: RefAndOnion) => {
        throw new Error(`Erhm... this should not be used`);
    }
};

const RefAndOnionContext = createContext<RefAndOnion>(emptyRAO);
const UpdaterContext = createContext<Update>(dummyUpdater);


export const Provider: React.FC = ({ children }) => {
    const [refAndOnion, setRefAndOnion] = useState(emptyRAO);

    return (
        <RefAndOnionContext.Provider value={refAndOnion}>
            <UpdaterContext.Provider value={{update: setRefAndOnion}}>
                {children}
            </UpdaterContext.Provider>
        </RefAndOnionContext.Provider>
    );
};

export const InPortal: React.FC<InPortalProps> = ({ transport: transportedRef }) => {
    const onion = useOnion();
    const refAndOnion = useContext(RefAndOnionContext);
    const updater = useContext(UpdaterContext);

    if (hasChanged(refAndOnion, onion, transportedRef)) {
        updater.update({
            ref: transportedRef,
            onion: onion,
        });
    }

    return null;
};

const hasChanged = (rao: RefAndOnion, onion: Onion, ref: Ref | null) => {
    return !eqOnion(rao.onion, onion) || !eqRef(rao.ref, ref);
};

export const OutPortal: React.FC<OutPortalProps> = ({ children }) => {
    const refAndOnion = useContext(RefAndOnionContext);

    return (
        <PlantOnionGarden onion={refAndOnion.onion}>
            {children(refAndOnion.ref)}
        </PlantOnionGarden>
    );
};

