import FoodType from "../data/FoodType";
import { findFood } from "../Store/Store";

export default RootReducer;

/**
 * Helper function to syntactically reverse the order of chained functions
 * @param {*} initialObject object to be transformed by the functions
 * @param {*} functions functions tha will transform the object
 */
function applyFunctionsTo(initialObject, functions) {
    return functions.reduce((obj, fun) => fun(obj), initialObject);
}

function RootReducer(state, action) {
    if (state === undefined) {
        console.error(">> RootReducer: missing initial state");
    }

    if (action.type === "IMPORT_DATA") {
        // TODO: do not accept data blindly but:
        //       - compute what is a derived value (e.g. macros) and
        //       - assign the id ourselves

        // reducer and its initial value
        const startValue = {
            lastEl: {id: 42},
            res: [],
        };
        const discoverNeighbouringDuplicates = (acc, item) => {
            // assuming that collection is sorted: first by id, then by version
            if (acc.lastEl.id === item.id &&
                acc.lastEl.version === item.version) {
                throw Error(`repeated item in imported data; id: ${item.id}; name: ${item.name}`);
            }
            
            // immutability is not needed for a local, temporary computation
            acc.lastEl = item;
            acc.res.push(item);
            return acc;
        };

        // TODO: use lens/accessor to get current data
        const mergedData = state.current.foodData.concat(action.data);
        const mergedAndSanitisedData = mergedData
                // sort by id, then by version (if ids equal)
                .sort((x, y) => {
                    const idCompare = x.id - y.id;
                    if (idCompare !== 0) return idCompare;
                    return x.version - y.version;
                })
                .reduce(discoverNeighbouringDuplicates, startValue)
                .res;
        return {
            ...state,
            current: {
                ...state.current,
                foodData: mergedAndSanitisedData,
            }
        };
    }

    if (action.type === "CHANGE_FOOD_QUANTITY") {
        return {
            ...state,
            current: {
                ...state.current,
                foodData: updateIngredientQuanatity(action, state.current.foodData, state),
            }
        };
    }

    return state;
};

const updateIngredientQuanatity = (action, allFoods, state) => {
    const {mealId, mealVersion, ingredientPosInMeal, newQuantity} = action;

    let mealToUpdate = null;
    const updatedFoods = allFoods
        .map(food => {
            if (food.id !== mealId || food.version !== mealVersion) return food;

            mealToUpdate = food;
            return {
                ...food,
                // TODO: update `usedBy` field of `food`
            };
        });

    if (mealToUpdate === null) {
        console.error(`Reducer: changing food quantity: meal to update not found! `
                + `meal id: ${mealId}, meal version: ${mealVersion}`);
    }

    const newVersionOfMeal = applyFunctionsTo(mealToUpdate, [
        updateIngredientQuantity(ingredientPosInMeal, newQuantity),
        calculateMacros(state),
        updateVersion(),
    ])
    updatedFoods.push(newVersionOfMeal); // 'updatedFoods' is a local var so we can modify it
    return updatedFoods;
};

// helper to be used with 'applyFunctionsTo'
const updateIngredientQuantity = (posToUpdate, newQuantity) => (meal) => {
    // TODO(perf): do not update version if it was not used by anything
    //       (requires the 'usedBy' field changes to be implemented)

    // TODO(perf): if new quantity is the same, return the same object

    return {
        ...meal,
        ingredientsRefs: meal.ingredientsRefs.map(foodRef => {
            if (foodRef.position !== posToUpdate) return foodRef;
            return {
                ...foodRef,
                quantity: newQuantity,
            };
        }),
    };
}

// helper to be used with 'applyFunctionsTo'
const calculateMacros = (state) => (meal) => {
    if (meal.type !== FoodType.Compound) {
        throw new Error(`${calculateMacros.name} should only be used for meals`);
    }

    // TODO(perf): if new macros are the same, return the input object

    const mealIngredients = meal.ingredientsRefs.map(foodRef => ({
        data: findFood(state, foodRef.id, foodRef.version),
        ref: foodRef,
    }));

    const sumMacro = (macroName) => (partialSum, food) =>
        partialSum + food.data.macros[macroName] * food.ref.quantity / 100;

    return {
        ...meal,
        macros: {
            fat: mealIngredients.reduce(sumMacro('fat'), 0),
            protein: mealIngredients.reduce(sumMacro('protein'), 0),
            carbs: mealIngredients.reduce(sumMacro('carbs'), 0),
        }
    };
}

// helper to be used with 'applyFunctionsTo'
const updateVersion = () => (food) => {
    // FIXME: doing 'version++' is not appropriate when updating a non-latest version;
    //        so, when updating, we need to find out what is the current latest existing version
    const newVersion = food.version + 1;
    return {
        ...food,
        version: newVersion,
    };
};

