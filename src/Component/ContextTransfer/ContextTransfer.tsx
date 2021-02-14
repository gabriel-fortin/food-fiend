import React, { ReactElement, useState } from "react";

import { Ref } from "Model";
import { eqOnion, Onion, PlantOnionGarden } from "Onion";
import { eqRef } from "tools";


export interface ContextReceiver {
    (o: Onion, r: Ref | null): void;
}


interface ContextProvider {
    (cr: ContextReceiver): React.ReactElement
}


interface ContextTransfererProps {
    contextProvider: ContextProvider
    contextConsumer: (r: Ref) => ReactElement
}


export const ContextTransfer: React.FC<ContextTransfererProps> = ({
    contextProvider,
    contextConsumer,
}) => {
    const [transferredOnion, setTransferredOnion] = useState<Onion>(Onion.create());
    const [transferredRef, setTransferredRef] = useState<Ref | null>(null);

    const receiver: ContextReceiver = (onion, ref) => {
        if (!eqOnion(transferredOnion, onion)) {
            setTransferredOnion(onion);
        }
        if (!eqRef(transferredRef, ref)){
            setTransferredRef(ref);
        }
    };

    return (
        <>
            {contextProvider(receiver)}
            <PlantOnionGarden onion={transferredOnion}>
                {transferredRef && contextConsumer(transferredRef)}
            </PlantOnionGarden>
        </>
    );

};