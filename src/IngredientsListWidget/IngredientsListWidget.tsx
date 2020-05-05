import React, { useState } from 'react';

import { MacrosInfo } from 'MacrosDisplay';
import { Ingredient, Food, Ref, Macros } from 'Model';

import './ingredients-list-widget.css';


// default value for some optional props
const warnThatMissing = (what: string) => () =>
    console.warn(`${IngredientsListWidget.name}: missing callback for '${what}'`);


interface ILWProps{
    data: {ingredient: Ingredient, food: Food}[];
    onQuantityChange: (pos: number, q: string) => void;
    onSelectionToggle?: (ref: Ref) => void;
}
export const IngredientsListWidget: React.FC<ILWProps> = ({
        data,
        onQuantityChange = warnThatMissing('quantity change'),
        onSelectionToggle = warnThatMissing('selection toggle')
    }) => {
    return (
        <div className="table-display">
            {headerRow()}
            {data.map(({ingredient: asIngredient, food: asFood}) =>
                <DataRow
                    // TODO: possible repeated key if e.g. butter if twice on the list
                    key={JSON.stringify(asFood.ref)}
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

interface DRProps {
    name: string;
    macros: Macros;
    quantity: number;
    onQuantityChange: (q: string) => void;
    onSelectionToggle: (ref: Ref) => void;
}
const DataRow: React.FC<DRProps> = ({name, macros, quantity, onQuantityChange, onSelectionToggle}) => {
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
            <div className="divider"/>

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
}

interface QEProps {
    quantity: number;
    userAbandonsEditing: () => void;
    userAcceptsQuantityChange: (q: string) => void;
}
const QuantityEditor: React.FC<QEProps> = ({quantity, userAbandonsEditing, userAcceptsQuantityChange}) => {
    return (
        <span className="quantity-editor">
            <input pattern="\d+(\.\d+)?"
                autoFocus
                onFocus={e => {
                    // when editing starts, put the current value in and select it
                    // so the user can enter a new value more easily
                    e.target.value = String(quantity);
                    e.target.select();
                }}
                onBlur={e => userAbandonsEditing()}
                onKeyUp={e => {
                    if (e.key === 'Escape') userAbandonsEditing();
                    if (e.key === 'Enter') userAcceptsQuantityChange((e.target as any).value);
                            // TODO: remove casting to 'any'
                }}
                />
        </span>
    );
}

