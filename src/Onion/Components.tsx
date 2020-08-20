import React from "react";

import { Ref } from "Model";

import { Onion, useOnion } from ".";
import { OnionReactContext } from "./Context";


interface OnionReceiver {
    (onion: Onion): React.ReactNode
}

export interface HasOnion {
    onion: Onion;
}

export const PositionLayerProvider: React.FC<{ position: number }> =
    ({ position, children }) => {
        // add one more layer to the onion
        const biggerOnion = useOnion().withPositionLayer(position);

        return (
            <OnionReactContext.Provider value={biggerOnion}>
                {children}
            </OnionReactContext.Provider>
        );
    };

export const FoodLayerProvider: React.FC<{ food: Ref, withOnion?: OnionReceiver }> =
    ({ food, withOnion, children }) => {
        // add one more layer to the onion
        const biggerOnion = useOnion().withFoodLayer(food);

        return (
            <OnionReactContext.Provider value={biggerOnion}>
                {withOnion && withOnion(biggerOnion)}
                {children}
            </OnionReactContext.Provider>
        );
    };

export const CurrentDayLayerProvider: React.FC =
    ({ children }) => {
        // add one more layer to the onion
        const biggerOnion = useOnion().withCurrentDayLayer();
        
        return (
            <OnionReactContext.Provider value={biggerOnion}>
                {children}
            </OnionReactContext.Provider>
        );
    };

export const PlantOnionGarden: React.FC<{ onion?: Onion }> =
    ({ onion, children }) =>
        <OnionReactContext.Provider value={onion || Onion.create()}>
            {children}
        </OnionReactContext.Provider>;
