import React from 'react';
import './macros-display.css';

export {MacrosBar, MacrosInfo, Macros}

class Macros {
    constructor(fat, protein, carbs) {
        this.fat = fat;
        this.protein = protein;
        this.carbs = carbs;
    }
}

function MacrosInfo(props) {
    /* TODO: extract input type validation to separate module/file */
    if (! (props.macros instanceof Macros)) {
        const errStyle = {
            backgroundColor: "lightpink",
            border: "2px solid red",
            padding: "3px",
            fontVariant: "small-caps",
        };
        return (
            <div style={errStyle}>
                in MacrosInfo: expected field "macros" of type "Macros"
            </div>
        );
    }

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
