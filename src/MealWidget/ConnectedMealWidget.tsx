import React from 'react';
import { connect } from 'react-redux';

import { changeIngredientQuantity, State } from 'Store';
import { Ref } from 'Model';
import Onion from 'Onion';

import { MealWidget } from './MealWidget';


// interface StateMapping {
//     (mealRef: Ref, uiEnclosure: Onion): (state: State) => {
            // ???
//     }
// }
// const mapStateToProps = (mealId, mealVersion, uiEnclosure) => (state) => {
const mapStateToProps = (mealRef: Ref, uiEnclosure: Onion) => (state: State) => {
    const meal = state.findFood(mealRef);
    const data = meal.ingredientsRefs
        .map(ingredient => {
            const food = state.findFood(ingredient.ref);
            return {
                ingredient,
                food,
            };
        });
    
    return {
        name: meal.name,
        totalMacros: meal.macros,
        data,
        uiEnclosure,
    };
};

const mapDispatchToProps = (uiEnclosure: Onion) => ({
    changeIngredientQuantity: (ingredientPos: number, newQuantity: string) => {
        // Replace any comma with a dot
        const quantityAsNumber = Number.parseFloat(newQuantity.replace(/,/, "."));

        const nestedEnclosure = uiEnclosure.withPositionLayer(ingredientPos);
        return changeIngredientQuantity(quantityAsNumber, nestedEnclosure);
    },
});


interface CMWProps {
    mealRef: Ref;
    uiEnclosure: Onion;
}
/**
 * Connects MealWidget to the redux store
 */
export const ConnectedMealWidget: React.FC<CMWProps> = ({mealRef, uiEnclosure = Onion.create()}) => {
    const nestedEnclosure = uiEnclosure.withFoodLayer(mealRef);
    
    const HereIAm = connect(
        mapStateToProps(mealRef, nestedEnclosure),
        mapDispatchToProps(nestedEnclosure),
    )(MealWidget);

    return <HereIAm />;
}
