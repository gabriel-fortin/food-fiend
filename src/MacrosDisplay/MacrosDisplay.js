import React from 'react';
import PropTypes from 'prop-types';
import './macros-display.css';


function MacrosInfo({macros}) {
    return (
        <div className="macros-info">
            {title("Fat")}
            {title("Protein")}
            {title("Carbs")}
            {value(macros.fat)}
            {value(macros.protein)}
            {value(macros.carbs)}
            <div className="bar">
                <MacrosBar macros={macros} />
            </div>
        </div>
    );
}

MacrosInfo.PropTypeDef = {
    macros: PropTypes.shape({
        fat: PropTypes.number.isRequired,
        protein: PropTypes.number.isRequired,
        carbs: PropTypes.number.isRequired,
    }).isRequired,
};
MacrosInfo.propTypes = MacrosInfo.PropTypeDef;

function title(text) {
    return (
        <div className="title">
            {text}
        </div>
    );
}

function value(text) {
    return (
        <div className="value">
            {text}
        </div>
    );
}

function MacrosBar({macros}) {
    return (
        <div className="macros-bar">
            {macro("fat", macros.fat)}
            {macro("protein", macros.protein)}
            {macro("carbs", macros.carbs)}
        </div>
    );
}

function macro(className, value) {
    let style = {
            flexGrow: value,
        };
    return (
        <div className={className} style={style} />
    );
}


export { MacrosBar, MacrosInfo }
