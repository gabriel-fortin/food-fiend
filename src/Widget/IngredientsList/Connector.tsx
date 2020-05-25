import React from "react";

import { Ref } from "Model";
import { useOnion } from "Onion";
import { changeIngredientQuantity, State } from "Store";

import { InitiallyStyledIngredientsList as IngredientsListUI } from "./InitiallyStyledIngredientsList";
import { connect } from "react-redux";


interface Props {
    mealRef: Ref;
}

export const Connector: React.FC<Props> = ({ mealRef }) => {
    const onion = useOnion();

    const mapState = (state: State) => {
        const meal = state.findFood(mealRef);
        const data = meal.ingredientsRefs.map(ingredient => (
            {
                ingredient,
                food: state.findFood(ingredient.ref),
            }
        ));
        return { data };
    };

    const mapDispatch = ({
        onQuantityChange: (ingredientPos: number, newQuantity: string) => {
            // Replace any comma with a dot
            const quantityAsNumber = Number.parseFloat(newQuantity.replace(/,/, "."));

            const glazedOnion = onion.withPositionLayer(ingredientPos);
            return changeIngredientQuantity(quantityAsNumber, glazedOnion);
        },
    });

    const ConnectedIngredientsList = connect(mapState, mapDispatch)(IngredientsListUI);
    return <ConnectedIngredientsList />;
};
