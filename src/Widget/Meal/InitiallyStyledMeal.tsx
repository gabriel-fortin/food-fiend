import React from "react";

import { MacrosInfo } from "Widget";
import { Macros } from "Model";

import { FoodAdder } from "./FoodAdder";
import "./meal-widget.css";


interface Props {
    name: string;
    totalMacros: Macros;
}

export const InitiallyStyledMeal: React.FC<Props> = ({ name, totalMacros, children }) => {
    return (
        <div className="meal">
            <div className="meal-header">
                <h2 className="meal-title">
                    {name}
                </h2>
                <div className="meal-macros">
                {/* TODO: maybe, make Macros Info read its own data */}
                    <MacrosInfo macros={totalMacros} />
                </div>
            </div>
            {children}
            <FoodAdder />
        </div>
    );
}
