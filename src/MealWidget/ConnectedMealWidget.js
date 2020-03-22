import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { findFood } from '../Store/Store';
import { changeIngredientQuantity } from '../ReduxyStuff/ActionCreators';
import { EnclosingContext_PropTypeDef, emptyEnclosure } from '../EnclosingContext';

import MealWidget from './MealWidget';


const mapStateToProps = (mealId, mealVersion, uiEnclosure) => (state) => {
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
        uiEnclosure,
    };
};

const mapDispatchToProps = (mealId, mealVersion, uiEnclosure) => ({
    changeIngredientQuantity: (ingredientPos, newQuantity) => {
        // Replace any comma with a dot
        const quantityAsNumber = Number.parseFloat(newQuantity.replace(/,/, "."));

        const nestedEnclosure = uiEnclosure.withPosition(ingredientPos);
        return changeIngredientQuantity(mealId, mealVersion, ingredientPos, quantityAsNumber, nestedEnclosure);
    },
});

/**
 * Connects MealWidget to the redux store
 */
const ConnectedMealWidget = ({mealId, mealVersion, uiEnclosure=emptyEnclosure()}) => {
    const nestedEnclosure = uiEnclosure.withFoodItem(mealId, mealVersion);

    const HereIAm = connect(
        mapStateToProps(mealId, mealVersion, nestedEnclosure),
        mapDispatchToProps(mealId, mealVersion, nestedEnclosure),
    )(MealWidget);

    return <HereIAm />;
}


ConnectedMealWidget.PropTypeDef = {
    mealId: PropTypes.number.isRequired,
    mealVersion: PropTypes.number.isRequired,
    uiEnclosure: EnclosingContext_PropTypeDef,
};
ConnectedMealWidget.propTypes = ConnectedMealWidget.PropTypeDef;


export default ConnectedMealWidget;
