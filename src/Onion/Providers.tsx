import React, { useContext, createContext } from "react";

import { Ref } from "Model";

import { Onion } from "./Onion";


const OnionReactContext = createContext(Onion.create());

export const useOnion: () => Onion = () =>
    useContext(OnionReactContext);

export const PositionLayerProvider: React.FC<{ position: number }> = ({ position, children }) => {
    const glazedOnion = useOnion().withPositionLayer(position);

    return (
        <OnionReactContext.Provider value={glazedOnion}>
            {children}
        </OnionReactContext.Provider>
    );
};

export const FoodLayerProvider: React.FC<{ food: Ref }> = ({ food, children }) => {
    const glazedOnion = useOnion().withFoodLayer(food);

    return(
        <OnionReactContext.Provider value={glazedOnion}>
            {children}
        </OnionReactContext.Provider>
    );
};