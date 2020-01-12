import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { findFood } from '../Store/Store';
import { changeIngredientQuantity } from '../ReduxyStuff/ActionCreators';
import { EnclosingContext_PropTypeDef, foodItemEnclosure } from '../EnclosingContext';

import MealWidget from './MealWidget';


const mapStateToProps = (mealId, mealVersion, uiEnclosure=[]) => (state) => {
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
        uiEnclosure: [...uiEnclosure, foodItemEnclosure(mealId)],
    };
};

const mapDispatchToProps = (mealId, mealVersion) => ({
    changeIngredientQuantity: (ingredientPos, newQuantity, uiEnclosure) => {
        // Replace any comma with a dot
        const quantityAsNumber = Number.parseFloat(newQuantity.replace(/,/, "."));
        return changeIngredientQuantity(mealId, mealVersion, ingredientPos, quantityAsNumber, uiEnclosure);
    },
});

/**
 * Connects MealWidget to the redux store
 */
const ConnectedMealWidget = ({mealId, mealVersion, uiEnclosure=[]}) => {
    const HereIAm = connect(
        mapStateToProps(mealId, mealVersion, uiEnclosure),
        mapDispatchToProps(mealId, mealVersion),
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
