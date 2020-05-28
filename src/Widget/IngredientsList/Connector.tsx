import React from "react";
import { connect } from "react-redux";

import { Ref } from "Model";
import { PositionLayerProvider } from "Onion";
import { useAppState } from "Store";

import { InitiallyStyledIngredientsList as IngredientsListUI } from "./InitiallyStyledIngredientsList";
import { DataRow } from "./DataRow";


interface Props {
    mealRef: Ref;
}

export const Connector: React.FC<Props> = ({ mealRef }) => {
    const meal = useAppState().findFood(mealRef);

    const ConnectedUI = connect()(IngredientsListUI);
    return (
        <ConnectedUI>
            {meal.ingredientsRefs.map(ingredient =>
                <PositionLayerProvider key={ingredient.key} position={ingredient.position}>
                    <DataRow ingredient={ingredient} />
                </PositionLayerProvider>
            )}
        </ConnectedUI>
    );
};
