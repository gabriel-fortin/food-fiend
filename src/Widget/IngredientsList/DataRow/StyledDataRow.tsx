import React, { useState } from "react";

import { Macros } from "Model";
import { MacrosInfo } from "Widget";

import { QuantityEditor } from "./QuantityEditor";


interface Props {
    name: string;
    macros: Macros;
    quantity: number;
    onQuantityChange: (newQuantity: string) => void;
}

export const StyledDataRow: React.FC<Props> = ({
    name,
    macros,
    quantity,
    onQuantityChange,
}) => {
    const [editMode, setEditMode] = useState(false);
    const userClicksQuantityValue = () => {
        setEditMode(true);
    };
    const userAcceptsQuantityChange = (newQuantity: string) => {
        onQuantityChange(newQuantity);
        setEditMode(false);
    };
    const userAbandonsEditing = () => {
        setEditMode(false);
    };

    return (
        <>
            <div className="divider" />

            <div className="name">
                <span>{name}</span>
            </div>
            <div className="macros">
                <MacrosInfo macros={macros} />
            </div>
            <div className="quantity" onClick={userClicksQuantityValue}>
                {
                    /* eslint-disable no-mixed-operators */
                    editMode
                    && <QuantityEditor
                        quantity={quantity}
                        userAbandonsEditing={userAbandonsEditing}
                        userAcceptsQuantityChange={userAcceptsQuantityChange}
                    />
                    || quantity
                    /* eslint-enable no-mixed-operators */
                }
                <span>g</span>
            </div>
        </>
    );
};
