import React from "react";

import { Ref } from "Model";

import { Onion, useOnion } from ".";
import { OnionReactContext } from "./Context";


export const PositionLayerProvider: React.FC<{ position: number }> = ({ position, children }) => {
    // add one more layer to the onion
    const glazedOnion = useOnion().withPositionLayer(position);

    return (
        <OnionReactContext.Provider value={glazedOnion}>
            {children}
        </OnionReactContext.Provider>
    );
};

export const FoodLayerProvider: React.FC<{ food: Ref }> = ({ food, children }) => {
    // add one more layer to the onion
    const glazedOnion = useOnion().withFoodLayer(food);

    return (
        <OnionReactContext.Provider value={glazedOnion}>
            {children}
        </OnionReactContext.Provider>
    );
};

export const PlantOnionGarden: React.FC<{ onion?: Onion }> = ({ onion, children }) =>
    <OnionReactContext.Provider value={onion || Onion.create()}>
        {children}
    </OnionReactContext.Provider>;
