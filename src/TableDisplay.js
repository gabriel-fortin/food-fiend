import React from 'react';
import './table-display.css';
import { MacrosInfo } from './MacrosDisplay';

export {TableDisplay};

function TableDisplay(props) {
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

