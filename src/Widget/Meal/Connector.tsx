import React from "react";
import { connect, MapDispatchToProps } from "react-redux";
import { Stack } from "@chakra-ui/core";

import { State, changeFoodName, removeIngredient } from "Store";
import { Ref } from "Model";
import { FoodLayerProvider, HasOnion } from "Onion";
import { IngredientsList, AppendIngredient } from "Widget";

import { InitiallyStyledMeal as MealUI, DispatchProps } from "./InitiallyStyledMeal";


interface Props {
    mealRef: Ref;
}

/**
 * Connects Meal to the redux store
 */
export const Connector: React.FC<Props> = ({ mealRef }) => {
    const mapState = (state: State) => {
        const meal = state.findFood(mealRef);
        return {
            name: meal.name,
            totalMacros: meal.macros,
        };
    };
    const mapDispatch: MapDispatchToProps<DispatchProps, HasOnion> = (_dispatch, { onion }) => ({
        onNameChange: (newName: string) => {
            return changeFoodName(newName, onion);
        },
        onRemoveMeal: () => {
            return removeIngredient(onion);
        },
    });
    const ConnectedUI: React.FC<Props & HasOnion> = connect(mapState, mapDispatch)(MealUI);


    // TODO: this component should not do visual work (Stack, alignment, ...)
    // it should provide the children elements to the UI component to place/render
    return (
        <FoodLayerProvider food={mealRef} withOnion={onion =>
            <ConnectedUI mealRef={mealRef} onion={onion}>
                <IngredientsList
                    mealRef={mealRef}
                />
                <Stack
                    isInline
                    alignItems="center"
                >
                    <AppendIngredient />
                </Stack>
            </ConnectedUI>
        }/>
    );
};
