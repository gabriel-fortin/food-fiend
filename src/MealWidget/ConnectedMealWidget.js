import React from 'react';
import { findFood } from '../Store/Store';
import { connect } from 'react-redux';
import MealWidget from './MealWidget';

const mapStateToProps = (mealId, mealVersion) => (state) => {
    const meal = findFood(state, mealId, mealVersion);
    const ingredients = meal.components
        .map(foodRef => {
            const data = findFood(state, foodRef.id, foodRef.version);
            return {
                id: foodRef.id,
                name: data.name,
                quantity: foodRef.quantity,
                macros: data.macros,
            };
        });

    return {
        name: meal.name,
        totalMacros: meal.macros,
        ingredients,
    };
};

// TODO: mapDispatchToProps
const mapDispatchToProps = {};

/**
 * Connects MealWidget to the redux store
 */
function ConnectedMealWidget({mealId, mealVersion}) {
    const Widget = connect(
        mapStateToProps(mealId, mealVersion),
        mapDispatchToProps
    )(MealWidget);

    return <Widget />;
}

export default ConnectedMealWidget;
