import React from 'react';
import { findFood } from '../Store/Store';
import { connect } from 'react-redux';
import { changeIngredientQuantity } from '../ReduxyStuff/ActionCreators';
import MealWidget from './MealWidget';

const mapStateToProps = (mealId, mealVersion) => (state) => {
    const meal = findFood(state, mealId, mealVersion);
    const ingredients = meal.ingredientsRefs
        .map(foodRef => {
            const foodData = findFood(state, foodRef.id, foodRef.version);
            return {
                ref: foodRef,
                data: foodData,
            };
        });

    return {
        name: meal.name,
        totalMacros: meal.macros,
        ingredients,
    };
};

const mapDispatchToProps = (mealId, mealVersion) => ({
    changeIngredientQuantity: (ingredientPos, newQuantity) =>
        changeIngredientQuantity(mealId, mealVersion, ingredientPos, newQuantity),
});

/**
 * Connects MealWidget to the redux store
 */
function ConnectedMealWidget({mealId, mealVersion}) {
    const Widget = connect(
        mapStateToProps(mealId, mealVersion),
        mapDispatchToProps(mealId, mealVersion),
    )(MealWidget);

    return <Widget />;
}

export default ConnectedMealWidget;
