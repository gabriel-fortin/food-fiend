import PropTypes from 'prop-types';

import { MacrosInfo } from '../MacrosDisplay/MacrosDisplay';
import { emptyEnclosure, EnclosingContext_PropTypeDef } from '../EnclosingContext';

import Food from './Food';


/*
 * This file is an API to the store.
 * All inputs should be type-verified here before actions are dispatched.
 */

const IngredientQuantityChangeAction_PropTypeDef = {
    type: PropTypes.oneOf(["CHANGE_FOOD_QUANTITY"]).isRequired,
    newQuantity: PropTypes.number.isRequired,
    context: EnclosingContext_PropTypeDef.isRequired,
};

const AddSimpleFoodAction_PropTypeDef = {
    type: PropTypes.oneOf(["ADD_SIMPLE_FOOD"]),
    name: PropTypes.string.isRequired,
    macros: MacrosInfo.PropTypeDef,
};

const ReplaceIngredientAction_PropTypeDef = {
    type: PropTypes.oneOf(["REPLACE INGREDIENT"]),
    newVersion: PropTypes.number.isRequired,
    context: EnclosingContext_PropTypeDef.isRequired,
};


function importData(data: Food) {
    // TODO: ActionCreators: validate input for 'importData'
    return {
        type: "IMPORT_DATA",
        data,
    };
}

// TODO: TS: make newQuantity of a weight type
function changeIngredientQuantity(newQuantity: number, context=emptyEnclosure()) {
    const action = {
        type: "CHANGE_FOOD_QUANTITY",
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
// TODO: TS: make macros and macrosUncertainty of appropriate types
function addSimpleFood(name: string, unit: string, macros: any, macrosUncertainty=false, extra={}) {
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


function replaceIngredient(newVersion: number, context=emptyEnclosure()) {
    // TODO: replace all id+ver with a new 'ref' type (this is a global change I'm requesting here)
    const action = {
        type: "REPLACE INGREDIENT",
        newVersion,
        context,
    };

    PropTypes.checkPropTypes(ReplaceIngredientAction_PropTypeDef, action,
        `parameter`, `${replaceIngredient.name}`);

    return action;
}

export { importData, changeIngredientQuantity, replaceIngredient, addSimpleFood };
