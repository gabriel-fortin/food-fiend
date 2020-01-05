import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { findFood } from '../Store/Store';
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
    changeIngredientQuantity: (ingredientPos, newQuantity) => {
        // Replace any comma with a dot
        const quantityAsNumber = Number.parseFloat(newQuantity.replace(/,/, "."));
        return changeIngredientQuantity(mealId, mealVersion, ingredientPos, quantityAsNumber);
    },
});

/**
 * Connects MealWidget to the redux store
 */
const ConnectedMealWidget = ({mealId, mealVersion}) => {
    const HereIAm = connect(
        mapStateToProps(mealId, mealVersion),
        mapDispatchToProps(mealId, mealVersion),
    )(MealWidget);

    return <HereIAm />;
}

ConnectedMealWidget.PropTypeDef = {
    mealId: PropTypes.number.isRequired,
    mealVersion: PropTypes.number.isRequired,
};
ConnectedMealWidget.propTypes = ConnectedMealWidget.PropTypeDef;

export default ConnectedMealWidget;
