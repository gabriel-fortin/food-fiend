import React from 'react';
import './meal-widget.css';
import { MacrosInfo } from '../MacrosDisplay/MacrosDisplay';
import { IngredientsDisplay, IngredientsDisplayEntry } from '../IngredientsDisplay/IngredientsDisplay';

function MealWidget({name, totalMacros, ingredients}) {
    const mappedIngredients = ingredients
        .map(x => new IngredientsDisplayEntry(
            x.id,
            x.name,
            x.quantity,
            x.macros,
            false
        ));
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
            <IngredientsDisplay data={mappedIngredients} />
        </div>
    );
}

export default MealWidget;
