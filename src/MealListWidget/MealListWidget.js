import React from 'react';
import PropTypes from 'prop-types';

import ConnectedMealWidget from '../MealWidget';
import { EnclosingContext_PropTypeDef } from '../EnclosingContext';


function MealListWidget({meals, uiEnclosure=[]}) {
    return meals.map(meal =>
        // TODO: MealListWidget: use a better value for 'key'?
        <ConnectedMealWidget key={meal.id} mealId={meal.id} mealVersion={meal.version} uiEnclosure={uiEnclosure}/>
    );
}

MealListWidget.PropTypeDef = PropTypes.arrayOf(
    PropTypes.shape({
        mealId: PropTypes.number.isRequired,
        mealVersion: PropTypes.number.isRequired,
        uiEnclosure: EnclosingContext_PropTypeDef,
    })
).isRequired;

export default MealListWidget;
