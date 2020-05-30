import React, { useState } from "react";

import { Macros } from "Model";
import { MacrosInfo } from "Widget";
import { QuantityEditor } from "UI";


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
            <Box className="divider" />

            <Box className="name">
                <span>{name}</span>
            </Box>
            <Box className="macros">
                <MacrosInfo macros={macros} />
            </Box>
            <Box className="quantity-editor" onClick={userClicksQuantityValue}>
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
            </Box>
        </>
    );
};
