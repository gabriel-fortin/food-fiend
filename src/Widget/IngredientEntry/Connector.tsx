import React from "react";
import { connect } from "react-redux";

import { Ingredient, FoodType } from "Model";
import { changeIngredientQuantity, State, removeIngredient } from "Store";
import { useOnion, FoodLayerProvider } from "Onion";
import { setWarningMessage } from "UI/ShowToasts";

import { StyledDataRow } from "./StyledDataRow";


interface Props {
    ingredient: Ingredient,
}

export const Connector: React.FC<Props> = ({ ingredient }) => {
    const onion = useOnion();

    const mapState = (state: State) => {
        const food = state.findFood(ingredient.ref);
        return {
            /* eslint-disable-next-line no-mixed-operators */
            name: (food.type===FoodType.Meal && "<meal>" || "") + food.name,
            entryRef: ingredient.ref,
            macros: food.macros,
            quantity: ingredient.quantity,
        };
    };

    const mapDispatch = ({
        onNameClick: () => {
            return setWarningMessage(`ingredient clicked`);
        },
        onQuantityChange: (newQuantity: string) => {
            // Replace any comma with a dot
            const quantityAsNumber = Number.parseFloat(newQuantity.replace(/,/, "."));

            return changeIngredientQuantity(quantityAsNumber, onion);
        },
        onRemoveEntry: () => {
            return removeIngredient(onion);
        },
    });

    const ConnectedUI = connect(mapState, mapDispatch)(StyledDataRow);
    return (
        <FoodLayerProvider food={ingredient.ref}>
            <ConnectedUI/>
        </FoodLayerProvider>
    );
};
