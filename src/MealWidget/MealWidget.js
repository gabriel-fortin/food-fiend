import React from 'react';
import './meal-widget.css';
import { MacrosInfo } from '../MacrosDisplay/MacrosDisplay';
import { IngredientsDisplay } from '../IngredientsDisplay/IngredientsDisplay';

function MealWidget({name, totalMacros, ingredients}) {
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
            <IngredientsDisplay ingredients={ingredients} />
        </div>
    );
}

export default MealWidget;
