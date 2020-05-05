import Onion from 'Onion';

import { Food, Macros, MacrosUncertainty } from 'Model';


// /*
//  * This file is an API to the store.
//  * All inputs should be type-verified here before actions are dispatched.
//  */

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
export function changeIngredientQuantity(
    newQuantity: number,
    context: Onion = Onion.create()
): ChangeIngredientQuantityAction {
    return {
        type: "CHANGE_FOOD_QUANTITY",
        newQuantity,
        context,
    };
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
    return {
        type: "ADD_SIMPLE_FOOD",
        name,
        unit,
        macros,
        macrosUncertainty,
        extra,
    };
}


export function replaceIngredient(
    newVersion: number,
    context=Onion.create()
): ReplaceIngredientAction {
    return {
        type: "REPLACE INGREDIENT",
        newVersion,
        context,
    };
}
