import React, { useState } from 'react';
import './ingredients-display.css';
import { MacrosInfo } from '../MacrosDisplay/MacrosDisplay';

class IngredientsDisplayEntry {
    constructor(id, name, quantity, macros, isSelected) {
        this.id = id;
        this.isSelected = isSelected;
        this.name = name;
        this.macros = macros;
        this.quantity = quantity;
    }

    /**
     * Returns a copy of this object with 'isSelected' set to given value
     * @param {boolean} isSelected 
     */
    withIsSelected(isSelected) {
        return new IngredientsDisplayEntry(this.id, this.name, this.quantity, this.macros, isSelected);
    }
}

// class TableDisplayData {
//     constructor(???) /* TODO define props to update entries and receive selection clicks */
// }

class RowData {
    constructor(name, quantity, macros, isSelected) {
        this.isSelected = isSelected;
        this.name = name;
        this.macros = macros;
        this.quantity = quantity;
    }

    static fromEntry(entry) {
        if (! (entry instanceof IngredientsDisplayEntry)) {
            throw Error("in 'failedEntry': failed transform, incorrect argument");
        }
        return new RowData(
            entry.name,
            entry.quantity,
            entry.macros,
            entry.isSelected
        )
    }
}

/* TODO: extract input type validation to separate module/file */
const errStyle = {
    backgroundColor: "lightpink",
    border: "2px solid red",
    padding: "3px",
    fontVariant: "small-caps",
};

const warnThatMissing = (what) => () =>
    console.warn(`${IngredientsDisplay.name}: missing callback for '${what}'`);

function IngredientsDisplay({
        data,
        onQuantityChange = warnThatMissing('quantity change'),
        onSelectionToggle = warnThatMissing('selection toggle')}) {
    /* TODO: extract input type validation to separate module/file */
    // if (! (Array.isArray(props.data))) {    /* TODO: change checked type to match code */
    //     return (
    //         <div style={errStyle}>
    //             in TableDisplay: expected field "data" of type "Array"
    //         </div>
    //     );
    // }

    return (
        <div className="table-display">
            {headerRow()}
            {data.map((x, i) => <DataRow key={x.id.toString()}
                data={RowData.fromEntry(x)}
                onQuantityChange={newQuantity => onQuantityChange(i, newQuantity)}
                onSelectionToggle={() => onSelectionToggle(x.id)}
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

function DataRow({data, onQuantityChange, onSelectionToggle}) {
    const [editMode, setEditMode] = useState(false);

    /* TODO: extract input type validation to separate module/file */
    const wideErrStyle = {
        ...errStyle,
        gridColumn: "1 / -1",
    };
    if (! (data instanceof RowData)) {
        return (
            <div style={wideErrStyle}>
                in TableDisplay:
                expected elements of "data" to be of type "{RowData.name}";
                was {data.constructor.name}
                {console.log(data)}
            </div>
        );
    }

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
                    e.target.value = data.quantity;
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
                <span>{data.name}</span>
            </div>
            <div className="macros">
                <MacrosInfo macros={data.macros} />
            </div>
            <div className="quantity" onClick={userClicksQuantityValue}>
                {
                    editMode
                        && quantityEditor  // eslint-disable-line no-mixed-operators
                        || data.quantity  // eslint-disable-line no-mixed-operators
                }
                <span>g</span>
            </div>
        </>
    );
}


export {IngredientsDisplay, IngredientsDisplayEntry};
