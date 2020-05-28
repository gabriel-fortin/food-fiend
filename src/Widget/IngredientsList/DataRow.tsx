import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { Ingredient } from "Model";
import { MacrosInfo } from "Widget";
import { useAppState, changeIngredientQuantity } from "Store";
import { useOnion } from "Onion";

import { QuantityEditor } from "./QuantityEditor";


// TODO: split into connector and UI


interface Props {
    ingredient: Ingredient,
}

export const DataRow: React.FC<Props> = ({ ingredient }) => {
    const food = useAppState().findFood(ingredient.ref);
    const onion = useOnion();
    const dispatch = useDispatch();  // TODO: use 'mapDispatch' and 'connect' intead of 'useDispatch'

    const [editMode, setEditMode] = useState(false);
    const userClicksQuantityValue = () => {
        setEditMode(true);
    };
    const userAcceptsQuantityChange = (newQuantity: string) => {
        // Replace any comma with a dot
        const quantityAsNumber = Number.parseFloat(newQuantity.replace(/,/, "."));
        
        dispatch(changeIngredientQuantity(quantityAsNumber, onion));
        setEditMode(false);
    };
    const userAbandonsEditing = () => {
        setEditMode(false);
    };

    return (
        <>
            <div className="divider" />

            <div className="name">
                <span>{food.name}</span>
            </div>
            <div className="macros">
                <MacrosInfo macros={food.macros} />
            </div>
            <div className="quantity" onClick={userClicksQuantityValue}>
                {
                    /* eslint-disable no-mixed-operators */
                    editMode
                    && <QuantityEditor
                        quantity={ingredient.quantity}
                        userAbandonsEditing={userAbandonsEditing}
                        userAcceptsQuantityChange={userAcceptsQuantityChange}
                    />
                    || ingredient.quantity
                    /* eslint-enable no-mixed-operators */
                }
                <span>g</span>
            </div>
        </>
    );
}
