import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './ingredients-display.css';
import { MacrosInfo } from '../MacrosDisplay/MacrosDisplay';

// default value for some optional props
const warnThatMissing = (what) => () =>
    console.warn(`${IngredientsDisplay.name}: missing callback for '${what}'`);

function IngredientsDisplay({
        populatedIngredients,
        onQuantityChange = warnThatMissing('quantity change'),
        onSelectionToggle = warnThatMissing('selection toggle')
    }) {
    return (
        <div className="table-display">
            {headerRow()}
            {populatedIngredients.map((ingredientData, i) => <DataRow
                // TODO: possible repeated key if butter twice on the list
                key={ingredientData.id}
                name={ingredientData.name}
                macros={ingredientData.macros}
                quantity={ingredientData.quantity}
                onQuantityChange={newQuantity => onQuantityChange(i, newQuantity)}
                onSelectionToggle={() => onSelectionToggle(ingredientData.id)}
            />)}
        </div>
    );
}

IngredientsDisplay.PropTypeDef = {
    populatedIngredients: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        version: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        macros: MacrosInfo.PropTypeDef.macros,
        quantity: PropTypes.number.isRequired,
        isSelected: PropTypes.bool,
    })).isRequired,
    onQuantityChange: PropTypes.func,
    onSelectionToggle: PropTypes.func,
};
IngredientsDisplay.propTypes = IngredientsDisplay.PropTypeDef;

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

function DataRow({name, macros, quantity, onQuantityChange, onSelectionToggle}) {
    const [editMode, setEditMode] = useState(false);

    const userClicksQuantityValue = () => {
        setEditMode(true);
    };
    const userAcceptsQuantityChange = (newQuantity) => {
        onQuantityChange(newQuantity);
        setEditMode(false);
    };
    const userAbandonsEditing = () => {
        setEditMode(false);
    };

    const quantityEditor =
        <span className="quantity-editor">
            <input pattern="\d+(\.\d+)?"
                autoFocus
                onFocus={e => {
                    // when editing starts, put the current value in and select it
                    // so the user can enter a new value more easily
                    e.target.value = quantity;
                    e.target.select();
                }}
                onBlur={e => userAbandonsEditing()}
                onKeyUp={e => {
                    if (e.key === 'Escape') userAbandonsEditing();
                    if (e.key === 'Enter') userAcceptsQuantityChange(e.target.value);
                }}
                />
        </span>;

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
                    editMode
                        && quantityEditor  // eslint-disable-line no-mixed-operators
                        || quantity  // eslint-disable-line no-mixed-operators
                }
                <span>g</span>
            </div>
        </>
    );
}


export { IngredientsDisplay };
