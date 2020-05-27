import React from "react";

import { Ingredient, Food, Ref } from "Model";

import { DataRow } from "./DataRow";
import "./ingredients-list-widget.css";


// default value for some optional props
const warnThatMissing = (what: string) => () =>
    console.warn(`${InitiallyStyledIngredientsList.name}: missing callback for '${what}'`);


interface Props {
    // TODO: let the row get the data itself
    data: {ingredient: Ingredient, food: Food}[];
    onQuantityChange: (pos: number, q: string) => void;
    onSelectionToggle?: (ref: Ref) => void;
}

export const InitiallyStyledIngredientsList: React.FC<Props> = ({
    data,
    onQuantityChange = warnThatMissing('quantity change'),
    onSelectionToggle = warnThatMissing('selection toggle')
}) => {
    return (
        <div className="table-display">
            {headerRow()}
            {data.map(({ ingredient: asIngredient, food: asFood }) =>
                <DataRow
                    key={asIngredient.key}
                    name={asFood.name}
                    macros={asFood.macros}
                    quantity={asIngredient.quantity}
                    onQuantityChange={(newQuantity: string) => onQuantityChange(asIngredient.position, newQuantity)}
                    onSelectionToggle={() => onSelectionToggle(asFood.ref)}
                />)}
        </div>
    );
}


function headerRow() {
    const headers = ["Product Name", "Macros", "Quantity"];
    const renderedHeaders = headers.map(header =>
        <div className="header" key={"header_" + header}>
            {header}
        </div>
    );
    return (
        <>
            {renderedHeaders}
        </>
    );
}

