import React from 'react';
import './meal-widget.css';
import { MacrosInfo, Macros } from '../MacrosDisplay/MacrosDisplay';
import { IngredientsDisplay, IngredientsDisplayEntry } from '../IngredientsDisplay/IngredientsDisplay';

function MealWidget({name, totalMacros, ingredients}) {
    const mealMacros = new Macros(totalMacros.fat, totalMacros.protein, totalMacros.carbs);
    const mappedIngredients = ingredients
        .map(x => new IngredientsDisplayEntry(
            x.id,
            x.name,
            x.quantity,
            new Macros(x.macros.fat, x.macros.protein, x.macros.carbs),
            false
        ));
    return (
        <div className="meal">
            <div className="meal-header">
                <h2 className="meal-title">
                    {name}
                </h2>
                <div className="meal-macros">
                    <MacrosInfo macros={mealMacros} />
                </div>
            </div>
            <IngredientsDisplay data={mappedIngredients} />
        </div>
    );
}

export default MealWidget;
