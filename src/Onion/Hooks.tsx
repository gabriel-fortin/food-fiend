import React, { useContext, createContext } from "react";

import { Ref } from "Model";

import { Onion } from "./Onion";
import { NonInitialisedOnion } from "./NonInitilisedOnion";


const OnionReactContext = createContext(new NonInitialisedOnion());

export const useOnion: () => Onion = () =>
    useContext(OnionReactContext);

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

    return(
        <OnionReactContext.Provider value={glazedOnion}>
            {children}
        </OnionReactContext.Provider>
    );
};

export const PlantOnionGarden: React.FC<{ onion: Onion }> = ({ onion, children }) =>
    <OnionReactContext.Provider value={onion}>
        {children}
    </OnionReactContext.Provider>;
