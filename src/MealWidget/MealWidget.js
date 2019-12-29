import React from 'react';
import './meal-widget.css';
import { MacrosInfo } from '../MacrosDisplay/MacrosDisplay';
import { IngredientsDisplay } from '../IngredientsDisplay/IngredientsDisplay';

function MealWidget({name, totalMacros, populatedIngredients}) {
    const mappedIngredients = populatedIngredients
        .map(x => ({
            id: x.id,
            version: x.version,
            name: x.name,
            macros: x.macros,
            quantity: x.quantity,
        }));
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
            <IngredientsDisplay populatedIngredients={mappedIngredients} />
        </div>
    );
}

export default MealWidget;
