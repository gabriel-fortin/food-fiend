import React from 'react';
import './macros-display.css';

export {MacrosBar}

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
