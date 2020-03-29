import Immer_produce from 'immer';

import FoodType from '../data/FoodType';

import { findFood, mutatePutFood as putFoodIntoMutableState, LATEST } from './Store';
import { replaceIngredient } from './ActionCreators';


export default rootReducer;

/**
 * Helper function to syntactically reverse the order of chained functions
 * @param {*} initialObject object to be transformed by the functions
 * @param {*} functions functions tha will transform the object
 */
function applyFunctionsTo(initialObject, functions) {
    return functions
        .reduce((obj, fun) => fun(obj), initialObject);
}

function rootReducer(state, action) {
    if (state === undefined) {
        console.error(">> RootReducer: missing initial state");
    }

    const newState = validateStateAfterReducing(routeAction(state, action));
    return newState;
}

function validateStateAfterReducing(state) {
    // TODO: Reducers: validate correctness of state after reducing
    return state;
}

function routeAction(state, action) {
    const reducersByActionType = {
        "IMPORT_DATA": reducer_importData,
        "CHANGE_FOOD_QUANTITY": reducer_changeIngredientQuantity,
        "REPLACE INGREDIENT": reducer_replaceIngredient,
    };

    // we start with one action to handle
    let actionsToProcess = [action];
    // reducers might add/trigger their own actions (which allowsw to put shared functionality into reducers)
    // they'll be called "synthetic actions"

    return Immer_produce(state, mutableState => {
        do {
            const currentAction = actionsToProcess.shift();
            const reducer = reducersByActionType[currentAction.type];

            // stop further processing if action is unrecognised
            if (reducer === undefined) {
                // but make an exception for initialisation done by Redux itself
                if (action.type.startsWith("@@redux/INIT")) break;

                console.error(`@Reducer: unhandled action: ${currentAction.type}`);

                // it's not normal if we can't handle the action
                throw new Error(`Unhandled action: ${currentAction.type}`);
            }

            console.debug(`@Reducers: calling reducer ${reducer.name}`);
            const additionalActions = reducer(currentAction, mutableState);
            console.debug(`@Reducers: additional actions from reducer for ${currentAction.type}: \n`,
                    JSON.stringify(additionalActions));

            actionsToProcess.push(...additionalActions);
        } while(actionsToProcess.length > 0)
        // if no changes were made, Immer returns the original object
    });
}

// CONVENTION
// functions of the form "reducer_*" take two arguments: action, mutable state

const reducer_importData = (action, mutableState) => {
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
        const mergedData = mutableState.current.foodData.concat(action.data);
        const mergedAndSanitisedData = mergedData
                // sort by id, then by version (if ids equal)
                .sort((x, y) => {
                    const idCompare = x.id - y.id;
                    if (idCompare !== 0) return idCompare;
                    return x.version - y.version;
                })
                .reduce(discoverNeighbouringDuplicates, startValue)
                .res;
        mutableState.current.foodData = mergedAndSanitisedData;

        return [];  // no more actions to take
        // MAYBE: this can use the 'add food' action for each imported item?
        // adding would be only one reducer's responsibility
};

const reducer_changeIngredientQuantity = (action, mutableState) => {
    const { newQuantity, context } = action;
    const {
        items: [{ pos: ingredientPosInMeal }, { id: mealId, ver: mealVersion }],
        remainingContext,
    } = context.popItems(2);

    const meal = findFood(mutableState, mealId, mealVersion);
    const updatedMeal = applyFunctionsTo(meal, [
        doUpdateVersion(mutableState),
        doModifyIngredientQuantityAtPos(ingredientPosInMeal, newQuantity),
        doCalculateMacros(mutableState),
    ]);
    putFoodIntoMutableState(mutableState, updatedMeal); // upsert; this will either replace (if version unchaged) or add the food

    const followUpAction = replaceIngredient(updatedMeal.version, remainingContext);
    return [followUpAction];

    // TODO: update EACH ingredient's 'usedBy', like so:
    // addRefToArrayIfNotThere(ingredient.usedBy, updatedMeal.id, updatedMeal.version);
};

const reducer_replaceIngredient = (action, mutableState) => {
    try {
        const { newVersion, context } = action;
        const {
            items: [{ pos: ingredientPosition }, parentRef],
            remainingContext,
        } = context.popItems(2);  // this throws if there are no items to pop

        const parentFood = findFood(mutableState, parentRef.id, parentRef.ver);
        const updatedParentFood = applyFunctionsTo(parentFood, [
            doUpdateVersion(mutableState),
            doUpdateIngredientVersionAtPos(ingredientPosition, newVersion),
            doCalculateMacros(mutableState),
        ]);
        putFoodIntoMutableState(mutableState, updatedParentFood);

        const followUpAction = replaceIngredient(updatedParentFood.version, remainingContext);
        return [followUpAction];

        // TODO: update each ingredients' 'usedBy'
    } catch (e) {
        if (e instanceof RangeError) return [];  // no more actions to process
        throw e;
    }
};


// helper to be used with 'applyFunctionsTo'
const doModifyIngredientQuantityAtPos = (posToUpdate, newQuantity) => (meal) => {
    // PERF: do not update version if it was not used by anything
    //       (requires the 'usedBy' field changes to be implemented)

    // PERF: if new quantity is the same, return the same object

    const quantityAsNumber = Number.parseFloat(newQuantity);
    if (!Number.isFinite(quantityAsNumber))
        throw new Error(`The new quantity '${newQuantity}' is not a number`);

    const updatedMeal = {
        ...meal,
        ingredientsRefs: meal.ingredientsRefs.map(foodRef => {
            if (foodRef.position !== posToUpdate) return foodRef;
            return {
                ...foodRef,
                quantity: quantityAsNumber,
            };
        }),
    };

    return updatedMeal;
};

// helper to be used with 'applyFunctionsTo'
const doUpdateIngredientVersionAtPos = (ingredientPosition, newVersion) => (meal) => {
    const updatedMeal = {
        ...meal,
        ingredientsRefs: meal.ingredientsRefs.map(foodRef => {
            if (foodRef.position !== ingredientPosition) return foodRef;
            return {
                ...foodRef,
                version: newVersion,
            };
        }),
    };

    return updatedMeal;
};

// helper to be used with 'applyFunctionsTo'
const doCalculateMacros = (state) => (meal) => {
    const handledTypes = [FoodType.Compound, FoodType.Day];

    if (!handledTypes.includes(meal.type)) {
        throw new Error(`${doCalculateMacros.name} should only be used for meals; ` + 
            `found: ${meal.type}, food: ${meal.name}`);
    }

    // TODO(perf): if new macros are the same, return the input object

    const mealIngredients = meal.ingredientsRefs.map(foodRef => ({
        data: findFood(state, foodRef.id, foodRef.version),
        ref: foodRef,
    }));

    const sumMacro = (macroName) => (partialSum, food) => {
        const macroStat = food.data.macros[macroName];
        const quantity = food.ref.quantity;
        const macroResultValue = macroStat * quantity / 100;
        return partialSum + macroResultValue;
    };

    const newMacros = {
        fat: mealIngredients.reduce(sumMacro('fat'), 0),
        protein: mealIngredients.reduce(sumMacro('protein'), 0),
        carbs: mealIngredients.reduce(sumMacro('carbs'), 0),
    };

    return {
        ...meal,
        macros: newMacros,
    };
    // TODO: calculate also uncertainty
};

// helper to be used with 'applyFunctionsTo'
const doUpdateVersion = (state) => (food) => {
    // a day exists only in a single version
    if (food.type === FoodType.Day) return food;
    // TODO: use an "isSingleton" function instead of comparing to 'Day'
    // this way when new FoodTypes are added this code doesn't need to change

    const latestVersionOfFood = findFood(state, food.id, LATEST);
    const newVersion = latestVersionOfFood.version + 1;
    return {
        ...food,
        version: newVersion,
    };
};

// helper to be used with 'applyFunctionsTo'
const doClearDependingMeals = () => (food) => {
    return {
        ...food,
        usedBy: [],
    };
};


const addRefToArrayIfNotThere = (someArray, id, version) => {
    for (let item of someArray) {
        if (item.id === id && item.version === version) return;
    }
    someArray.push({id, version});
};
