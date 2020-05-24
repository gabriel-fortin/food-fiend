import React from "react";

import { MacrosInfo } from "Widget";
import { Macros, Food, Ingredient } from "Model";
import { IngredientsListWidget } from "Widget";
import Onion, { PlantOnionGarden } from "Onion";

import { FoodAdder } from "./FoodAdder";
import "./meal-widget.css";


interface Props {
    name: string;
    totalMacros: Macros;
    data: {ingredient: Ingredient, food: Food}[];
    changeIngredientQuantity: (pos: number, q: string) => void;
    uiEnclosure: Onion;
}

export const MealWidget: React.FC<Props> = ({name, totalMacros, data, changeIngredientQuantity, uiEnclosure = Onion.create()}) => {
    // TODO: when IngredientsList becomes more independent, pass 'uiEnclosure' to it
    return (
        <div className="meal">
            <div className="meal-header">
                <h2 className="meal-title">
                    {name}
                </h2>
                <div className="meal-macros">
                    <MacrosInfo macros={totalMacros} />
                </div>
            </div>
            <IngredientsListWidget
                data={data}
                onQuantityChange={(pos: number, q: string) => changeIngredientQuantity(pos, q)}
                onSelectionToggle={undefined}
            />
            <PlantOnionGarden onion={uiEnclosure}>
                <FoodAdder />
            </PlantOnionGarden>
        </div>
    );
}
