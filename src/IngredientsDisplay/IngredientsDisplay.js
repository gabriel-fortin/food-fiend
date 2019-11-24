import React from 'react';
import './ingredients-display.css';
import { MacrosInfo } from '../MacrosDisplay/MacrosDisplay';
import tickImage from './tick.svg';

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

const warnThatMissing = (_id) => {console.warn("no callback for selection toggle")};

function IngredientsDisplay({data, onSelectionToggle = warnThatMissing}) {
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
            {data.map(x => dataRow(
                x.id.toString(),
                RowData.fromEntry(x),
                () => onSelectionToggle(x.id)
            ))}
        </div>
    );
}

function headerRow() {
    const headers = ["Included", "Product Name", "Macros", "Quantity"];
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

function dataRow(reactKey, data, onSelectionToggle) {
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
    if (reactKey === undefined) {
        return (
            <div style={wideErrStyle}>
                in TableDisplay: expected "TableDisplayEntry" elements to have "id"
            </div>
        );
    }

    const selectionBoxClass = "selection " + (data.isSelected ? "selected" : "");

    return (
        <React.Fragment key={reactKey}>
            <div className="divider"/>

            <div className={selectionBoxClass} onClick={onSelectionToggle}>
                <img src={tickImage} alt={"selected " + data.name} />
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
        </React.Fragment>
    );
}


export {IngredientsDisplay, IngredientsDisplayEntry};
