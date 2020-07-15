import { Onion } from 'Onion';

import { Food, Macros, MacrosUncertainty, Ref, FoodType, StorageInfo, Message } from "Model";


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

export interface AddFoodAction {
    type: "ADD_FOOD",
    name: string,
    foodType: FoodType,
    unit: string,
    macros: Macros,
    macrosUncertainty: MacrosUncertainty,
    extra: object,
    context: Onion,
}

export interface ReplaceIngredientAction {
    type: "REPLACE INGREDIENT",
    replacement: Ref,
    context: Onion,
}

export interface SetCurrentDayAction {
    type: "SET CURRENT DAY",
    dayRef: Ref,
}

export interface AppendIngredientAction {
    type: "APPEND INGREDIENT",
    ingredientRef: Ref,
    context: Onion,
}

export interface RemoveIngredientAction {
    type: "REMOVE INGREDIENT",
    context: Onion,
}

export interface ChangeFoodNameAction {
    type: "CHANGE FOOD NAME",
    newName: string,
    context: Onion,
}

export interface SetMessageAction {
    type: "SET MESSAGE",
    messagePayload: Message | null,
}

export type Action =
    | ImportDataAction
    | ChangeIngredientQuantityAction
    | AddFoodAction
    | ReplaceIngredientAction
    | SetCurrentDayAction
    | AppendIngredientAction
    | RemoveIngredientAction
    | ChangeFoodNameAction
    | SetMessageAction
    ;


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
    context: Onion,
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
): AddFoodAction {
    // TODO: this sction seems not to be used at all
    return {
        type: "ADD_FOOD",
        name,
        foodType: FoodType.BaseIngredient,
        unit,
        macros,
        macrosUncertainty,
        extra,
        context: Onion.create(),  // empty context
    };
}

/**
 * Add composite food to a parent food
 */
export function addCompositeFood(
    context: Onion,
    foodType: FoodType,
    name: string,
    unit: string,
    extra: any = {},
): AddFoodAction {
    return {
        type: "ADD_FOOD",
        name,
        foodType,
        unit,
        macros: new Macros(0, 0, 0),
        macrosUncertainty: false,
        extra,
        context,
    };
}

/** Action creator */
export function replaceIngredient(
    replacement: Ref,
    context: Onion,
): ReplaceIngredientAction {
    return {
        type: "REPLACE INGREDIENT",
        replacement,
        context,
    };
}

/** Action creator */
export function setCurrentDay(dayRef: Ref): SetCurrentDayAction {
    return {
        type: "SET CURRENT DAY",
        dayRef,
    };
}

/** Action creator */
export function appendIngredient(ingredientRef: Ref, context: Onion): AppendIngredientAction {
    return {
        type: "APPEND INGREDIENT",
        ingredientRef,
        context,
    };
}

/** Action creator */
export function removeIngredient(context: Onion): RemoveIngredientAction {
    return {
        type: "REMOVE INGREDIENT",
        context,
    };
}

/** Action creator */
export function changeFoodName(newName: string, context: Onion): ChangeFoodNameAction {
    return {
        type: "CHANGE FOOD NAME",
        newName,
        context,
    };
}

/** Action creator */
export function setErrorMessage(message: string | null): SetMessageAction {
    return {
        type: "SET MESSAGE",
        messagePayload: (message === null) ? null
            : {
                status: "error",
                text: message,
            }
    };
}

/** Action creator */
export function setSuccessMessage(message: string | null): SetMessageAction {
    return {
        type: "SET MESSAGE",
        messagePayload: (message === null) ? null
            : {
                status: "success",
                text: message,
            }
    };
}

/** Action creator */
export function setInfoMessage(message: string | null): SetMessageAction {
    return {
        type: "SET MESSAGE",
        messagePayload: (message === null) ? null
            : {
                status: "info",
                text: message,
            }
    };
}

/** Action creator */
export function setWarningMessage(message: string | null): SetMessageAction {
    return {
        type: "SET MESSAGE",
        messagePayload: (message === null) ? null
            : {
                status: "warning",
                text: message,
            }
    };
}
