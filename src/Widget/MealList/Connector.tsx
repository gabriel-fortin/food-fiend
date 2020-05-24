import React from "react";
import { connect, useStore } from "react-redux";

import Onion from "Onion";
import { Ref } from "Model";
import { useAppState } from "Store";
import { ConnectedMealWidget } from "Widget";

import { UnstyledMealList as MealListUI } from "./UnstyledMealList";


interface Props {
    dayRef: Ref;
    onion: Onion;
}

export const Connector: React.FC<Props> = ({ dayRef, onion }) => {
    const state = useAppState();
    const ingredients = state.findFood(dayRef).ingredientsRefs;
    const glazedOnion = onion.withFoodLayer(dayRef);
    
    const Connected = connect()(MealListUI);

    return (
        <Connected>
            {ingredients.map((ingredient) =>
                <ConnectedMealWidget
                    key={ingredient.key}
                    mealRef={ingredient.ref}
                    uiEnclosure={glazedOnion.withPositionLayer(ingredient.position)}
                />
                // TODO: replace above with use a more generic 'Meal' from 'Widget'
            )}
        </Connected>
    );
};
