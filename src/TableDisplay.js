import React from 'react';
import './table-display.css';
import { MacrosInfo } from './MacrosDisplay';

export {TableDisplay, ProductEntry};

class ProductEntry {
    constructor(name, quantity, macros, isSelected = false) {
        this.isSelected = isSelected;
        this.name = name;
        this.macros = macros;
        this.quantity = quantity;
    }
}

/* TODO: extract input type validation to separate module/file */
const errStyle = {
    backgroundColor: "lightpink",
    border: "2px solid red",
    padding: "3px",
    fontVariant: "small-caps",
};

function TableDisplay(props) {
    /* TODO: extract input type validation to separate module/file */
    if (! (Array.isArray(props.data))) {
        return (
            <div style={errStyle}>
                in TableDisplay: expected field "data" of type "Array"
            </div>
        );
    }

    return (
        <div className="table-display">
            {tableTitleRow()}
            {props.data.map(x => tableRow(x))}
        </div>
    );
}

function tableTitleRow() {
    const headers = ["Included", "Product Name", "Macros", "Quantity"];
    return headers.map(header =>
        <div className="header">
            {header}
        </div>
    );
}

function tableRow(data) {
    /* TODO: extract input type validation to separate module/file */
    if (! (data instanceof ProductEntry)) {
        const wideErrStyle = {
            ...errStyle,
            gridColumn: "1 / -1",
        };
        return (
            <div style={wideErrStyle}>
                in TableDisplay: expected elements of "data" to be of type "ProductEntry"
            </div>
        );
    }

    return (
        <>
            <div className="divider" />

            <div className="selection">
                <input type="button">
                    {/* TODO: image for ticked state */}
                </input>
            </div>
            <div className="name">
                <span>{data.name}</span>
            </div>
            <div className="macros">
                <MacrosInfo macros={data.macros} />
            </div>
            <div className="quantity">
                {data.quantity}g
            </div>
        </>
    );
}

