import { Food, FoodType, Macros, MacrosUncertainty, Ref } from "Model";
import { Onion } from "Onion";


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
    callback: (newItem: Ref | null) => void,
}

export interface ReplaceIngredientAction {
    type: "REPLACE INGREDIENT",
    replacement: Ref,
    context: Onion,
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

export interface ChangeFoodVersionAction {
    type: "CHANGE FOOD VERSION",
    newVersion: typeof Ref.prototype.ver,
    context: Onion,
}
