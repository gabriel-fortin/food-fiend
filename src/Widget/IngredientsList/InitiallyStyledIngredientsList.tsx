import React from "react";

import "./ingredients-list-widget.css";


interface Props {
}

export const InitiallyStyledIngredientsList: React.FC<Props> = ({ children }) => {
    return (
        <div className="table-display">
            {headerRow()}
            {children}
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

