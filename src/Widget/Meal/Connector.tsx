import React from "react";
import { connect } from "react-redux";

import { changeIngredientQuantity, State } from "Store";
import { Ref } from "Model";
import { useOnion } from "Onion";

import { InitiallyStyledMeal as MealUI } from "./InitiallyStyledMeal";


interface Props {
    mealRef: Ref;
}

/**
 * Connects Meal to the redux store
 */
export const Connector: React.FC<Props> = ({ mealRef }) => {
    const onion = useOnion();

    const mapStateToProps = (state: State) => {
        const meal = state.findFood(mealRef);
        const data = meal.ingredientsRefs.map(ingredient => (
            {
                ingredient,
                food: state.findFood(ingredient.ref),
            }
        ));
        return {
            name: meal.name,
            totalMacros: meal.macros,
            data,
        };
    };

    const mapDispatchToProps = {
        changeIngredientQuantity: (ingredientPos: number, newQuantity: string) => {
            // Replace any comma with a dot
            const quantityAsNumber = Number.parseFloat(newQuantity.replace(/,/, "."));
    
            const glazedOnion = onion.withPositionLayer(ingredientPos);
            return changeIngredientQuantity(quantityAsNumber, glazedOnion);
        },
    };

    const Connected = connect(mapStateToProps, mapDispatchToProps)(MealUI);
    return (
        <Connected>
            {/* TODO: render ingredients here */}
        </Connected>
    );
}
