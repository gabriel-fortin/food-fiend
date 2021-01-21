import { Food, Macros, FoodType, MacrosUncertainty, Ref } from "Model";
import { Onion } from "Onion";

import { ImportDataAction, ChangeIngredientQuantityAction, AddFoodAction, ReplaceIngredientAction, AppendIngredientAction, RemoveIngredientAction, ChangeFoodNameAction, ChangeFoodVersionAction }
    from "./DataActions";


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
    callback: (newItem: Ref | null) => void = () => { },
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
        callback,
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
    callback: (newItem: Ref | null) => void = () => { },
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
        callback,
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
export function changeFoodVersion(newVersion: number, context: Onion): ChangeFoodVersionAction {
    return {
        type: "CHANGE FOOD VERSION",
        newVersion,
        context,
    };
}
