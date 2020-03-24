import Immer_produce from "immer";
import FoodType from "../data/FoodType";
import { findFood, mutatePutFood as putFoodIntoMutableState } from "../Store/Store";
import { replaceIngredient } from "./ActionCreators";

export default RootReducer;

/**
 * Helper function to syntactically reverse the order of chained functions
 * @param {*} initialObject object to be transformed by the functions
 * @param {*} functions functions tha will transform the object
 */
function applyFunctionsTo(initialObject, functions) {
    return functions
        .reduce((obj, fun) => fun(obj), initialObject);
}

function RootReducer(state, action) {
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

    // =======================================================================
    // from this place, a newer reducing style is used
    // TODO: translate old reducers to new style

    const reducersByActionType = {
        "CHANGE_FOOD_QUANTITY": reducer_changeIngredientQuantity,
        "REPLACE INGREDIENT": reducer_replaceIngredient,
    };
    // we start with one action to handle
    let actionsToProcess = [action];
    // reducers might add their own actions (so we can put shared functionality into reducers)
    // they'll be called "synthetic actions"

    return Immer_produce(state, mutableState => {
        do {
            const currentAction = actionsToProcess.shift();
            const reducer = reducersByActionType[currentAction.type];

            // stop further processing if action is unrecognised
            if (reducer === undefined) {
                if (action.type.startsWith("@@redux/INIT")) break;

                console.error(`@Reducer: unhandled action: ${currentAction.type}`);

                //it's not normal if we can't handle the action
                throw new Error(`Unhandled action: ${currentAction.type}`);
            }

            console.debug(`@Reducers: calling reducer ${reducer.name}`);
            const additionalActions = reducer(currentAction, mutableState);
            console.debug(`@Reducers: additional actions from reducer for ${currentAction.type}: `,
                    JSON.stringify(additionalActions));

            actionsToProcess.push(...additionalActions);
        } while(actionsToProcess.length > 0)
        // if no changes were made, Immer returns the original object
    });
}

// CONVENTION
// functions of the form "reducer_*" take two arguments: action, mutable state

const reducer_changeIngredientQuantity = (action, mutableState) => {
    const {mealId, mealVersion, ingredientPosInMeal, newQuantity, context} = action;
    const context1 = context;
    context1.popItems(2);

    const meal = findFood(mutableState, mealId, mealVersion);

    const updatedMeal = applyFunctionsTo(meal, [
        doUpdateVersion(),
        doModifyIngredientQuantityAtPos(ingredientPosInMeal, newQuantity),
        doCalculateMacros(mutableState),
    ]);
    putFoodIntoMutableState(mutableState, updatedMeal); // upsert; this will either replace (if version unchaged) or add the food

    // TODO: update EACH ingredient's 'usedBy', like so:
    // addRefToArrayIfNotThere(ingredient.usedBy, updatedMeal.id, updatedMeal.version);
    
    const {
        items: [{pos: mealPosInParent}, mealParent],
        remainingContext: context3,
    } = context2.popItems(2);

    if (mealParent === undefined) {
        return [];
    }
    const syntheticAction = replaceIngredient(mealParent.id, mealParent.ver,
        mealPosInParent, updatedMeal.version, context3);
    return [syntheticAction];
};

const reducer_replaceIngredient = (action, mutableState) => {
    console.debug(`@Reducer: replace ingredient, action:`, action);
    const {parentId, parentVersion, ingredientPosition, newVersion, context} = action;

    const parentFood = findFood(mutableState, parentId, parentVersion);

    const updatedParentFood = applyFunctionsTo(parentFood, [
        doUpdateVersion(),
        doUpdateIngredientVersionAtPos(ingredientPosition, newVersion),
        doCalculateMacros(mutableState),
    ]);
    putFoodIntoMutableState(mutableState, updatedParentFood);

    const {
        items: [parentPosInSuperParent, superParent],
        remainingContext: outerContext
    } = context.popItems(2);
    if (superParent === undefined) {
        return [];
    }
    const syntheticAction = replaceIngredient(superParent.id, superParent.ver,
        parentPosInSuperParent.pos, updatedParentFood.version, outerContext);
    return [syntheticAction];

    // TODO: update each ingredients' 'usedBy'
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
            if (foodRef.position != ingredientPosition) return foodRef;
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
const doUpdateVersion = () => (food) => {
    // a day exists only in a single version
    if (food.type === FoodType.Day) return food;

    // FIXME: doing 'version++' is not appropriate when updating a non-latest version;
    //        so, when updating, we need to find out what is the current latest existing version
    const newVersion = food.version + 1;
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

