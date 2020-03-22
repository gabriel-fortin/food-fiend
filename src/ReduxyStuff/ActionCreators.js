import PropTypes from 'prop-types';
import { MacrosInfo } from '../MacrosDisplay/MacrosDisplay';
import { emptyEnclosure } from '../EnclosingContext';

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

const ReplaceIngredientAction_PropTypeDef = {
    type: PropTypes.oneOf(["REPLACE INGREDIENT"]),
    id: PropTypes.number.isRequired,
    version: PropTypes.number.isRequired,
    ingredientPosition: PropTypes.number.isRequired,
    ingredientQuantity: PropTypes.number.isRequired,
    context: PropTypes.array,
};


function importData(data) {
    // TODO: ActionCreators: validate input for 'importData'
    return {
        type: "IMPORT_DATA",
        data,
    };
}

function changeIngredientQuantity(mealId, mealVersion, ingredientPosInMeal, newQuantity, context=emptyEnclosure()) {
    const action = {
        type: "CHANGE_FOOD_QUANTITY",
        mealId,
        mealVersion,
        ingredientPosInMeal,
        newQuantity,
        context: context,
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


// TODO: parent id and parent version can be taken from context
//       no need to provide them explicitly
function replaceIngredient(parentId, parentVersion, ingredientPosition, newVersion, context=emptyEnclosure()) {
    // TODO: replace all id+ver with a new 'ref' type (this is a global change I'm requesting here)
    const action = {
        type: "REPLACE INGREDIENT",
        parentId,
        parentVersion,
        ingredientPosition,
        newVersion,
        context,
    };

    PropTypes.checkPropTypes(ReplaceIngredientAction_PropTypeDef, action,
        `parameter`, `${replaceIngredient.name}`);

    return action;
}

export { importData, changeIngredientQuantity, replaceIngredient, addSimpleFood };
