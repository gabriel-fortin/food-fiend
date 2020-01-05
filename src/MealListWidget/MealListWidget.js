import React from 'react';
import PropTypes from 'prop-types';

import ConnectedMealWidget from '../MealWidget';


function MealListWidget({meals}) {
    return meals.map(meal =>
        // TODO: MealListWidget: use a better value for 'key'?
        <ConnectedMealWidget key={meal.id} mealId={meal.id} mealVersion={meal.version}/>
    );
}

MealListWidget.PropTypeDef = PropTypes.arrayOf(
    PropTypes.shape({
        mealId: PropTypes.number.isRequired,
        mealVersion: PropTypes.number.isRequired,
    })
).isRequired;

export { MealListWidget };
