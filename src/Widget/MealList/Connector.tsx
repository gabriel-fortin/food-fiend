import React from "react";
import { connect } from "react-redux";

import { Ref } from "Model";
import { useAppState } from "Store";
import { Meal } from "Widget";

import { UnstyledMealList as MealListUI } from "./UnstyledMealList";
import { FoodLayerProvider, PositionLayerProvider } from "Onion";


interface Props {
    dayRef: Ref;
}

export const Connector: React.FC<Props> = ({ dayRef }) => {
    const state = useAppState();
    const ingredients = state.findFood(dayRef).ingredientsRefs;
    
    const ConnectedMealList = connect()(MealListUI);
    return (
        <FoodLayerProvider food={dayRef}>
            <ConnectedMealList>
                {ingredients.map((ingredient) =>
                    <PositionLayerProvider key={ingredient.key} position={ingredient.position}>
                        <Meal mealRef={ingredient.ref} />
                    </PositionLayerProvider>
                )}
            </ConnectedMealList>
        </FoodLayerProvider>
    );
};
