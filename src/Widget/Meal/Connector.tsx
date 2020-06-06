import React from "react";
import { connect } from "react-redux";

import { State, changeFoodName } from "Store";
import { Ref } from "Model";
import { FoodLayerProvider, useOnion } from "Onion";
import { IngredientsList } from "Widget";

import { InitiallyStyledMeal as MealUI } from "./InitiallyStyledMeal";


interface Props {
    mealRef: Ref;
}

/**
 * Connects Meal to the redux store
 */
export const Connector: React.FC<Props> = ({ mealRef }) => {
    return (
        <FoodLayerProvider food={mealRef}>
            <ConnectedMeal mealRef={mealRef}>
                <IngredientsList
                    mealRef={mealRef}
                />
            </ConnectedMeal>
        </FoodLayerProvider>
    );
}

const ConnectedMeal: React.FC<{ mealRef: Ref }> = ({ mealRef }) => {
    const onion = useOnion();

    const mapState = (state: State) => {
        const meal = state.findFood(mealRef);
        return {
            name: meal.name,
            totalMacros: meal.macros,
        };
    };
    const mapDispatch = ({
        onNameChange: (newName: string) => {
            console.log(`Connector: on Name Change; newName: ${newName}`);
            
            return changeFoodName(newName, onion);
        },
    });

    const ConnectedMeal = connect(mapState, mapDispatch)(MealUI);
    return (
        <ConnectedMeal>
            <IngredientsList
                mealRef={mealRef}
            />
        </ConnectedMeal>
    );
};
