import React from 'react';

import { Macros } from 'Model';

import './macros-display.css';


interface MIProps {
    macros: Macros;
}
export const MacrosInfo: React.FC<MIProps> = ({macros}) => 
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
    </div>;

const title = (text: string) => 
    <div className="title">
        {text}
    </div>;

const value = (x: number) => {
    let precisionParam =
            x >= 10 ? 1 :
            x >= 1 ? 10 :
            100;
    return (
        <div className="value">
            {Math.round(x * precisionParam) / precisionParam}
        </div>
    );
}


export const MacrosBar: React.FC<MIProps> = ({macros}) =>
    <div className="macros-bar">
        {macro("fat", macros.fat)}
        {macro("protein", macros.protein)}
        {macro("carbs", macros.carbs)}
    </div>;

const macro = (className: string, value: number) => {
    let style = {
            flexGrow: value,
        };
    return (
        <div className={className} style={style} />
    );
};
