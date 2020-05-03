import PropTypes from 'prop-types';

import { MacrosInfo } from 'MacrosDisplay/MacrosDisplay';
import Onion from 'Onion';

import { Food, Macros, MacrosUncertainty } from 'Model';


// /*
//  * This file is an API to the store.
//  * All inputs should be type-verified here before actions are dispatched.
//  */

// const IngredientQuantityChangeAction_PropTypeDef = {
//     type: PropTypes.oneOf(["CHANGE_FOOD_QUANTITY"]).isRequired,
//     newQuantity: PropTypes.number.isRequired,
//     context: EnclosingContext_PropTypeDef.isRequired,
// };

// const AddSimpleFoodAction_PropTypeDef = {
//     type: PropTypes.oneOf(["ADD_SIMPLE_FOOD"]),
//     name: PropTypes.string.isRequired,
//     macros: MacrosInfo.PropTypeDef,
// };

// const ReplaceIngredientAction_PropTypeDef = {
//     type: PropTypes.oneOf(["REPLACE INGREDIENT"]),
//     newVersion: PropTypes.number.isRequired,
//     context: EnclosingContext_PropTypeDef.isRequired,
// };

export interface ImportDataAction {
    type: "IMPORT_DATA",
    data: Food[],
}

export interface ChangeIngredientQuantityAction {
    type: "CHANGE_FOOD_QUANTITY",
    newQuantity: number,
    context: Onion,
}

export interface AddSimpleFoodAction {
    type: "ADD_SIMPLE_FOOD",
    name: string,
    unit: string,
    macros: Macros,
    macrosUncertainty: MacrosUncertainty,
    extra: any,
}

export interface ReplaceIngredientAction {
    type: "REPLACE INGREDIENT",
    newVersion: number,
    context: Onion,
}

export type ActionType = {type: "IMPORT_DATA" | "CHANGE_FOOD_QUANTITY" | "ADD_SIMPLE_FOOD" | "REPLACE INGREDIENT"};
export type Action = ActionType & (
        | ImportDataAction
        | ChangeIngredientQuantityAction
        | AddSimpleFoodAction
        | ReplaceIngredientAction
    );


export function importData(data: Food[]): ImportDataAction {
    // TODO: ActionCreators: validate input for 'importData'
    return {
        type: "IMPORT_DATA",
        data,
    };
}

// TODO: TS: make newQuantity of a weight type
export function changeIngredientQuantity(newQuantity: number, context: Onion = Onion.create()): ChangeIngredientQuantityAction {
    const action: ChangeIngredientQuantityAction = {
        type: "CHANGE_FOOD_QUANTITY",
        newQuantity,
        context,
    };

    // PropTypes.checkPropTypes(IngredientQuantityChangeAction_PropTypeDef, action,
    //     `parameter`, `${changeIngredientQuantity.name}`);

    return action;
}

/**
 * Add simple food to the store
 */
export function addSimpleFood(
    name: string,
    unit: string,
    macros: Macros,
    macrosUncertainty: MacrosUncertainty = false,
    extra: any = {},
): AddSimpleFoodAction {
    const action: AddSimpleFoodAction = {
        type: "ADD_SIMPLE_FOOD",
        name,
        unit,
        macros,
        macrosUncertainty,
        extra,
    };

    // PropTypes.checkPropTypes(AddSimpleFoodAction_PropTypeDef, action,
        // `parameter`, `${addSimpleFood.name}`);

    return action;
}


export function replaceIngredient(newVersion: number, context=Onion.create()): ReplaceIngredientAction {
    const action: ReplaceIngredientAction = {
        type: "REPLACE INGREDIENT",
        newVersion,
        context,
    };

    // PropTypes.checkPropTypes(ReplaceIngredientAction_PropTypeDef, action,
    //     `parameter`, `${replaceIngredient.name}`);

    return action;
}
