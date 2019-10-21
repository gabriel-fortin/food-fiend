import React from 'react';
import './macros-display.css';

export {MacrosBar, MacrosInfo}

function MacrosInfo(props) {
    return (
        <div class="macros-info">
            {title("Fat")}
            {title("Protein")}
            {title("Carbs")}
            {value(props.macros.fat)}
            {value(props.macros.protein)}
            {value(props.macros.carbs)}
            <div className="bar">
                <MacrosBar macros={props.macros} />
            </div>
        </div>
    );
}

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

function MacrosBar(props) {
    return (
        <div class="macros-bar">
            {macro("fat", props.macros.fat)}
            {macro("protein", props.macros.protein)}
            {macro("carbs", props.macros.carbs)}
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
