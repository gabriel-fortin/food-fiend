export { importData, changeIngredientQuantity }

function importData(data) {
    return {
        type: "IMPORT_DATA",
        data,
    };
}

function changeIngredientQuantity(mealId, ingredientPosInMeal, newQuantity) {
    return {
        type: "CHANGE_FOOD_QUANTITY",
        mealId,
        ingredientPosInMeal,
        newQuantity,
    };
}
