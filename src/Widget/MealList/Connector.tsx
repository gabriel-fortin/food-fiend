import React, { ReactNode } from "react";
import { connect } from "react-redux";

import { Ref, FoodType } from "Model";
import { useAppState, State, addCompositeFood } from "Store";
import { Meal } from "Widget";

import { UnstyledMealList as MealListUI } from "./UnstyledMealList";
import { FoodLayerProvider, PositionLayerProvider, useOnion } from "Onion";


interface Props {
    dayRef: Ref;
}

export const Connector: React.FC<Props> = ({ dayRef }) => {
    const food = useAppState().findFood(dayRef);
    const ingredients = food.ingredientsRefs;

    return (
        <FoodLayerProvider food={dayRef}>
            <ConnectedMealList dayRef={dayRef}>
                {ingredients.map((ingredient) =>
                    <PositionLayerProvider key={ingredient.key} position={ingredient.position}>
                        <Meal mealRef={ingredient.ref} />
                    </PositionLayerProvider>
                )}
            </ConnectedMealList>
        </FoodLayerProvider>
    );
};

const ConnectedMealList: React.FC<{ dayRef: Ref, children: ReactNode[] }> = ({ dayRef, children }) => {
    const onion = useOnion();

    const mapState = (state: State) => ({
        title: state.findFood(dayRef).name,
    });
    const mapDispatch = {
        onAddMealClick: () => addCompositeFood(
            onion,
            FoodType.Meal,
            "",
            "g",
        ),
    };
    
    const ConnectedMealList = connect(mapState, mapDispatch)(MealListUI);
    return (
        <ConnectedMealList>
            {children}
        </ConnectedMealList>
    );
};
