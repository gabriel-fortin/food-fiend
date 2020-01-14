import PropTypes from 'prop-types';
import { MacrosInfo } from '../MacrosDisplay/MacrosDisplay';

/*
 * This file is an API to the store.
 * All inputs should be type-verified here before actions are dispatched.
 */

const IngredientQuantityChangeAction_PropTypeDef = {
    mealId: PropTypes.number.isRequired,
    mealVersion: PropTypes.number.isRequired,
    ingredientPosInMeal: PropTypes.number.isRequired,
    newQuantity: PropTypes.number.isRequired,
    autoUpdate: PropTypes.arrayOf(PropTypes.number),
};

const AddSimpleFoodAction_PropTypeDef = {
    name: PropTypes.string.isRequired,
    macros: MacrosInfo.PropTypeDef,
};


function importData(data) {
    // TODO: ActionCreators: validate input for 'importData'
    return {
        type: "IMPORT_DATA",
        data,
    };
}

function changeIngredientQuantity(mealId, mealVersion, ingredientPosInMeal, newQuantity, autoUpdate=[]) {
    const action = {
        type: "CHANGE_FOOD_QUANTITY",
        mealId,
        mealVersion,
        ingredientPosInMeal,
        newQuantity,
        autoUpdate,
    };

    PropTypes.checkPropTypes(IngredientQuantityChangeAction_PropTypeDef, action,
        `parameter`, `${changeIngredientQuantity.name}`);

    return action;
}

/**
 * Add simple food to the store
 */
function addSimpleFood(name, unit, macros, macrosUncertainty=false, extra={}) {
    const action = {
        type: "ADD_SIMPLE_FOOD",
        name,
        unit,
        macros,
        macrosUncertainty,
        extra,
    };

    PropTypes.checkPropTypes(AddSimpleFoodAction_PropTypeDef, action,
        `parameter`, `${addSimpleFood.name}`);

    return action;
}

export { importData, changeIngredientQuantity, addSimpleFood };
