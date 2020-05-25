import React from "react";
import { connect } from "react-redux";

import { Ref } from "Model";
import { useAppState } from "Store";
import { Meal } from "Widget";

import { UnstyledMealList as MealListUI } from "./UnstyledMealList";


interface Props {
    dayRef: Ref;
}

export const Connector: React.FC<Props> = ({ dayRef }) => {
    const state = useAppState();
    const ingredients = state.findFood(dayRef).ingredientsRefs;
    
    const Connected = connect()(MealListUI);
    return (
        <Connected>
            {ingredients.map((ingredient) =>
                <Meal
                    key={ingredient.key}
                    mealRef={ingredient.ref}
                />
            )}
        </Connected>
    );
};
