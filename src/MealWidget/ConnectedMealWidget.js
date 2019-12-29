import React from 'react';
import { findFood } from '../Store/Store';
import { connect } from 'react-redux';
import MealWidget from './MealWidget';

const mapStateToProps = (mealId, mealVersion) => (state) => {
    const meal = findFood(state, mealId, mealVersion);
    const populatedIngredients = meal.components
        .map(foodRef => {
            const data = findFood(state, foodRef.id, foodRef.version);
            return {
                id: data.id,
                version: data.version,
                name: data.name,
                quantity: foodRef.quantity,
                macros: data.macros,
            };
        });

    return {
        name: meal.name,
        totalMacros: meal.macros,
        populatedIngredients,
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
