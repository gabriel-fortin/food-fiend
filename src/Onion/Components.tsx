import React from "react";

import { Ref } from "Model";

import { Onion, useOnion } from ".";
import { OnionReactContext } from "./Context";



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

export const FoodLayerProvider: React.FC<{ food: Ref }> =
    ({ food, children }) => {
        // add one more layer to the onion
        const biggerOnion = useOnion().withFoodLayer(food);

        return (
            <OnionReactContext.Provider value={biggerOnion}>
                {children}
            </OnionReactContext.Provider>
        );
    };

export const RootRefLayerProvider: React.FC =
    ({ children }) => {
        // add one more layer to the onion
        const biggerOnion = useOnion().withRootRefLayer();
        
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

/** Injects the onion (as a prop) to a component implementing 'HasOnion' */
export const withOnion: OnionInjector =
    (Component) => (props) => (
        <Component {...props} onion={useOnion()} />
    );

interface OnionInjector {
    <Props> (Component: React.FC<Props & HasOnion>): React.FC<Props>
}
