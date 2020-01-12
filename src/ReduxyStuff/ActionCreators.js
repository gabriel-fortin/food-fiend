import PropTypes from 'prop-types';

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

export { importData, changeIngredientQuantity };
