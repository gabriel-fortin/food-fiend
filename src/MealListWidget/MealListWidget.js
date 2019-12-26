import React from 'react';
import ConnectedMealWidget from '../MealWidget';

function MealListWidget({meals}) {
    return meals.map(meal => 
        <ConnectedMealWidget key={meal.id} mealId={meal.id} mealVersion={meal.version}/>
    );
}

export { MealListWidget };
