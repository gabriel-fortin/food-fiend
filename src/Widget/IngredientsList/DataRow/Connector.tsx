import React from "react";
import { connect } from "react-redux";

import { Ingredient } from "Model";
import { changeIngredientQuantity, State } from "Store";
import { useOnion } from "Onion";

import { StyledDataRow } from "./StyledDataRow";


interface Props {
    ingredient: Ingredient,
}

export const Connector: React.FC<Props> = ({ ingredient }) => {
    const onion = useOnion();

    const mapState = (state: State) => {
        const food = state.findFood(ingredient.ref);
        return {
            name: food.name,
            macros: food.macros,
            quantity: ingredient.quantity,
        };
    };

    const mapDispatch = ({
        onQuantityChange: (newQuantity: string) => {
            // Replace any comma with a dot
            const quantityAsNumber = Number.parseFloat(newQuantity.replace(/,/, "."));

            return changeIngredientQuantity(quantityAsNumber, onion);
        },
    });

    const ConnectedUI = connect(mapState, mapDispatch)(StyledDataRow);
    return (<ConnectedUI/>);
};
