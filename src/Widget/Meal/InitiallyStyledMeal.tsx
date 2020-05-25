import React from "react";

import { MacrosInfo } from "Widget";
import { Macros, Food, Ingredient } from "Model";
import { IngredientsListWidget } from "Widget";

import { FoodAdder } from "./FoodAdder";
import "./meal-widget.css";


interface Props {
    name: string;
    totalMacros: Macros;
    data: { ingredient: Ingredient, food: Food }[];
    changeIngredientQuantity: (pos: number, q: string) => void;
}

export const InitiallyStyledMeal: React.FC<Props> = ({name, totalMacros, data, changeIngredientQuantity }) => {
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
            {/* TODO: make Ingredient List read its own data */}
            <IngredientsListWidget
                data={data}
                onQuantityChange={(pos: number, q: string) => changeIngredientQuantity(pos, q)}
                onSelectionToggle={undefined}
            />
            <FoodAdder />
        </div>
    );
}
