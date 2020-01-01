import React from 'react';
import PropTypes from 'prop-types';
import './meal-widget.css';
import { MacrosInfo } from '../MacrosDisplay/MacrosDisplay';
import IngredientsListWidget from '../IngredientsListWidget';

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
            <IngredientsListWidget ingredients={ingredients} />
        </div>
    );
}

MealWidget.PropTypeDef = {
    name: PropTypes.string.isRequired,
    totalMacros: MacrosInfo.PropTypeDef.macros,
    ingredients: PropTypes.arrayOf(PropTypes.shape(
        IngredientsListWidget.PropTypeDef.ingredients
    )).isRequired,
};
MealWidget.propTypes = MealWidget.PropTypeDef;

export default MealWidget;
