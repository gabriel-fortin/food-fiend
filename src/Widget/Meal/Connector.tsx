import React from "react";
import { connect } from "react-redux";

import { State } from "Store";
import { Ref } from "Model";
import { FoodLayerProvider } from "Onion";
import { IngredientsList } from "Widget";

import { InitiallyStyledMeal as MealUI } from "./InitiallyStyledMeal";


interface Props {
    mealRef: Ref;
}

/**
 * Connects Meal to the redux store
 */
export const Connector: React.FC<Props> = ({ mealRef }) => {
    const mapStateToProps = (state: State) => {
        const meal = state.findFood(mealRef);
        return {
            name: meal.name,
            totalMacros: meal.macros,
        };
    };
    const ConnectedMeal = connect(mapStateToProps)(MealUI);

    return (
        <FoodLayerProvider food={mealRef}>
            <ConnectedMeal>
                <IngredientsList
                    mealRef={mealRef}
                />
            </ConnectedMeal>
        </FoodLayerProvider>
    );
}
