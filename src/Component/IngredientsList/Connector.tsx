import React from "react";
import { connect } from "react-redux";

import { Ref } from "Model";
import { PositionLayerProvider } from "Onion";
import { useAppState } from "Store";
import { IngredientEntry } from "Component";

import { InitiallyStyledIngredientsList as IngredientsListUI } from "./InitiallyStyledIngredientsList";


interface Props {
    mealRef: Ref;
}

export const Connector: React.FC<Props> = ({ mealRef }) => {
    const meal = useAppState().findFood(mealRef);

    if (meal.ingredientsRefs.length === 0) {
        return (
            <>
                <div>No food yet in this meal</div>
            </>
        );
    }

    const ConnectedUI = connect()(IngredientsListUI);
    return (
        <ConnectedUI>
            {meal.ingredientsRefs.map(ingredient =>
                <PositionLayerProvider key={ingredient.key} position={ingredient.position}>
                    <IngredientEntry ingredient={ingredient} />
                </PositionLayerProvider>
            )}
        </ConnectedUI>
    );
};
