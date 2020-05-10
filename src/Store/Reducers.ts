import Immer_produce from 'immer';

import { Food, Ref, Ingredient, FoodType } from 'Model';
import { PositionLayer, RefLayer } from 'Onion';

import { State, mutatePutFood as putFoodIntoMutableState } from './Store';
import {
    replaceIngredient, Action,
    ImportDataAction, ChangeIngredientQuantityAction, ReplaceIngredientAction, SetCurrentDayAction, setCurrentDay
} from './ActionCreators';


/**
 * Helper function prettier chaining
 * @param {*} initialObject object to be transformed by the functions
 * @param {*} functions functions tha will transform the object
 */
function applyFunctionsTo<T>(initialObject: T, functions: ((o: T) => T)[]): T {
    return functions
        .reduce((obj, fun) => fun(obj), initialObject);
}

export function rootReducer(state: State | undefined, action: Action): State {
    if (state === undefined) {
        console.error(">> RootReducer: missing initial state");
    }

    const cheatedState = state as State;
    const newState = validateStateAfterReducing(routeAction(cheatedState, action));
    return newState;
}

function validateStateAfterReducing(state: State): State {
    // TODO: Reducers: validate correctness of state after reducing
    return state;
}

function routeAction(state: State, action: Action): State {
    type ActualReducer = (a: Action, s: State) => Action[];
    // TODO: use discriminated unions?
    const reducersByActionType: Map<string, ActualReducer> = new Map([
        ["IMPORT_DATA", reducer_importData],
        ["CHANGE_FOOD_QUANTITY", reducer_changeIngredientQuantity],
        ["REPLACE INGREDIENT", reducer_replaceIngredient],
        ["SET CURRENT DAY", reducer_setCurrentDay],
    ]);

    // we start with one action to handle
    let actionsToProcess = [action];
    // reducers might add/trigger their own actions (which allowsw to put shared functionality into reducers)
    // they'll be called "synthetic actions"

    return Immer_produce(state, (mutableState: State) => {
        do {
            const currentAction: Action = actionsToProcess.shift() as Action; // never undefined
            const reducer = reducersByActionType.get(currentAction.type);

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

// TODO: change type of action to ImportDataAction; use discriminated unions in caller
const reducer_importData = (action: Action, mutableState: State): Action[] => {
    // TODO: do not accept data blindly but:
    //       - compute what is a derived value (e.g. macros) and
    //       - assign the id ourselves

    // reducer and its initial value
    type Acc = { lastElRef: Ref, res: Food[] };
    const startValue: Acc = {
        lastElRef: { id: 42, ver: -1 },
        res: [],
    };
    const discoverNeighbouringDuplicates = (acc: Acc, item: Food) => {
        // assuming that collection is sorted: first by id, then by version
        if (acc.lastElRef === item.ref) {
            throw Error(`repeated item in imported data; id: ${item.ref.id}; name: ${item.name}`);
        }
        
        // immutability is not needed for a local, temporary computation
        acc.lastElRef = item.ref;
        acc.res.push(item);
        return acc;
    };

    // TODO: use lens/accessor to get current data
    const mergedData = mutableState.foodData.concat((action as ImportDataAction).data);  // TODO: remove casting
    const mergedAndSanitisedData = mergedData
            // sort by id, then by version (if ids equal)
            .sort((x: Food, y: Food) => {
                const idCompare: number = x.ref.id - y.ref.id;
                if (idCompare !== 0) return idCompare;
                return x.ref.ver - y.ref.ver;
            })
            .reduce(discoverNeighbouringDuplicates, startValue)
            .res;
    mutableState.foodData = mergedAndSanitisedData;

    return [];  // no more actions to take
    // MAYBE: this can use the 'add food' action for each imported item?
    // adding would be only one reducer's responsibility
};

const reducer_changeIngredientQuantity = (action: Action, mutableState: State): Action[] => {
    const { newQuantity, context } = action as ChangeIngredientQuantityAction;

    const [[layer1, layer2], remainingContext] = context.peelLayers(2);
    const ingredientPosInMeal = (layer1 as PositionLayer).pos;
    const mealRef = (layer2 as RefLayer).ref;

    const meal = mutableState.findFood(mealRef);
    const updatedMeal = applyFunctionsTo(meal, [
        doUpdateVersion(mutableState),
        doModifyIngredientQuantityAtPos(ingredientPosInMeal, newQuantity),
        doCalculateMacros(mutableState),
    ]);
    putFoodIntoMutableState(mutableState, updatedMeal); // upsert; this will either replace (if version unchaged) or add the food

    const followUpAction = replaceIngredient(updatedMeal.ref.ver, remainingContext);
    return [followUpAction];

    // TODO: update EACH ingredient's 'usedBy', like so:
    // addRefToArrayIfNotThere(ingredient.usedBy, updatedMeal.id, updatedMeal.version);
};

const reducer_replaceIngredient = (action: Action, mutableState: State): Action[] => {
        const { newVersion, context } = action as ReplaceIngredientAction;

        const [[layer1, layer2], remainingContext] = context.peelLayers(2);
        const ingredientPosition = (layer1 as PositionLayer).pos;
        const parentRef = (layer2 as RefLayer).ref;

        const parentFood = mutableState.findFood(parentRef);
        console.log(`REPLACE INGREDIENT reducer, parent food ref: ${JSON.stringify(parentFood.ref)}`);
        const updatedParentFood = applyFunctionsTo(parentFood, [
            doUpdateVersion(mutableState),
            doUpdateIngredientVersionAtPos(ingredientPosition, newVersion),
            doCalculateMacros(mutableState),
        ]);
        console.log(`REPLACE INGREDNEIT reducer, updated parent food ref: ${JSON.stringify(updatedParentFood.ref)}`);
        
        putFoodIntoMutableState(mutableState, updatedParentFood);


        if (remainingContext.layersLeft() > 0) {
            return [replaceIngredient(updatedParentFood.ref.ver, remainingContext)];
        } else {
            return [setCurrentDay(updatedParentFood.ref)];
        }

        // TODO: update each ingredients' 'usedBy'
};

const reducer_setCurrentDay = (action: Action, mutableState: State): Action[] => {
    const { dayRef } = action as SetCurrentDayAction;
    console.log(`setting current.day, before: ${JSON.stringify(mutableState.getCurrentDay())}`);
    mutableState.day = dayRef;
    // mutableState.current = {
    //     ...mutableState.current,
    //     day: dayRef,
    // };
    console.log(`setting current.day, after: ${JSON.stringify(mutableState.getCurrentDay())}`);
    return [];
};


// helper to be used with 'applyFunctionsTo'
const doModifyIngredientQuantityAtPos = (posToUpdate: number, newQuantity: number) => (meal: Food): Food => {
    // PERF: do not update version if it was not used by anything
    //       (requires the 'usedBy' field changes to be implemented)

    // PERF: if new quantity is the same, return the same object

    const quantityAsNumber = Number.parseFloat(newQuantity.toString());
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
const doUpdateIngredientVersionAtPos = (ingredientPosition: number, newVersion: number) => (meal: Food): Food => {
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
const doCalculateMacros = (state: State) => (meal: Food): Food => {
    const handledTypes = [FoodType.Compound, FoodType.Day];

    if (!handledTypes.includes(meal.type)) {
        throw new Error(`${doCalculateMacros.name} should only be used for meals; ` + 
            `found: ${meal.type}, food: ${meal.name}`);
    }

    // TODO(perf): if new macros are the same, return the input object

    type FoodAndIngredient = { food: Food, ingredient: Ingredient}
    const mealIngredients: FoodAndIngredient[] = meal.ingredientsRefs.map(ingredient => ({
        food: state.findFood(ingredient.ref),
        ingredient,
    }));

    const sumMacro = (macroName: string) => (partialSum: number, fai: FoodAndIngredient) => {
        const macroStat = (fai.food.macros as any)[macroName];
        const quantity = fai.ingredient.quantity;
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
const doUpdateVersion = (state: State) => (food: Food): Food => {
    const latestVersionOfFood = state.findFoodLatest(food.ref.id);
    const newVersion = latestVersionOfFood.ref.ver + 1;
    return {
        ...food,
        ref: {
            ...food.ref,
            ver: newVersion,
        },
    };
};

// helper to be used with 'applyFunctionsTo'
const doClearDependingMeals = () => (food: Food): Food => {
    return {
        ...food,
        usedBy: [],
    };
};


const addRefToArrayIfNotThere = (someArray: any[], id: number, version: number): void => {
    for (let item of someArray) {
        if (item.id === id && item.version === version) return;
    }
    someArray.push({id, version});
};

