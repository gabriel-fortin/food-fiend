import React from 'react';
import PropTypes from 'prop-types';

import { MacrosInfo } from '../MacrosDisplay/MacrosDisplay';
import IngredientsListWidget from '../IngredientsListWidget';
import { EnclosingContext_PropTypeDef, emptyEnclosure } from '../EnclosingContext';

import './meal-widget.css';


function MealWidget({name, totalMacros, ingredients, changeIngredientQuantity, uiEnclosure=emptyEnclosure()}) {
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
                ingredients={ingredients}
                onQuantityChange={(pos, q) => changeIngredientQuantity(pos, q)}
            />
        </div>
    );
}

MealWidget.PropTypeDef = {
    name: PropTypes.string.isRequired,
    totalMacros: MacrosInfo.PropTypeDef.macros,
    ingredients: PropTypes.arrayOf(PropTypes.shape(
        IngredientsListWidget.PropTypeDef.ingredients
    )).isRequired,
    onQuantityChange: PropTypes.func,
    uiEnclosure: EnclosingContext_PropTypeDef,
};
MealWidget.propTypes = MealWidget.PropTypeDef;

export default MealWidget;
