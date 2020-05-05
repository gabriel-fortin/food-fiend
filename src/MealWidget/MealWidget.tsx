import React from 'react';

import { MacrosInfo } from 'MacrosDisplay';
import { Macros, Food, Ingredient } from 'Model';
import IngredientsListWidget from 'IngredientsListWidget';
import Onion from 'Onion';

import './meal-widget.css';


interface MWProps {
    name: string;
    totalMacros: Macros;
    data: {ingredient: Ingredient, food: Food}[];
    changeIngredientQuantity: (pos: number, q: string) => void;
    uiEnclosure: Onion;
}
export const MealWidget: React.FC<MWProps> = ({name, totalMacros, data, changeIngredientQuantity, uiEnclosure = Onion.create()}) => {
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
        </div>
    );
}
