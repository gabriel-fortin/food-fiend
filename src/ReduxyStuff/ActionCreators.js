export { importData, changeFoodQuantity }

function importData(data) {
    return {
        type: "IMPORT_DATA",
        data,
    };
}

function changeFoodQuantity(mealId, foodPosInMeal, newQuantity) {
    return {
        type: "CHANGE_FOOD_QUANTITY",
        mealId,
        foodPosInMeal,
        newQuantity,
    };
}
