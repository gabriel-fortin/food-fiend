import Immer_produce from 'immer';

import { Food, Ref, Ingredient, FoodType, Macros } from 'Model';
import { PositionLayer, RefLayer } from 'Onion';

import { State, mutatePutFood as putFoodIntoMutableState } from './Store';
import {
    replaceIngredient, setCurrentDay,
    Action,
    ImportDataAction, ChangeIngredientQuantityAction, ReplaceIngredientAction,
     SetCurrentDayAction, AppendIngredientAction, RemoveIngredientAction, ChangeFoodNameAction
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

/**
 * Works like '.filter' but expects exactly one element to match predicate.
 * 
 * Returns the single element that matches the predicate.
 */
function filterOne<T>(array: T[], predicate: (x: T) => boolean) {
    const arrayWithOneElement = array.filter(predicate);

    const len = arrayWithOneElement.length;
    if (len !== 1) throw new Error(`Expected exactly one element but found ${len}`);

    return arrayWithOneElement[0];
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
    // reducers might add/trigger their own actions (which allows to put shared functionality into reducers)
    // they'll be called "synthetic actions"

    return Immer_produce(state, (mutableState: State) => {
        /// we start with no backlog of actions to handle
        let actionsToProcess: Action[] = [];
        let currentAction: Action | undefined = action;

        do {
            let newSyntheticActions: Action[] = [];
            switch (currentAction.type) {
                case "IMPORT_DATA": 
                    newSyntheticActions = reducer_importData(currentAction, mutableState);
                    break;
                case "CHANGE_FOOD_QUANTITY":
                    newSyntheticActions = reducer_changeIngredientQuantity(currentAction, mutableState);
                    break;
                case "REPLACE INGREDIENT":
                    newSyntheticActions = reducer_replaceIngredient(currentAction, mutableState);
                    break;
                case "SET CURRENT DAY":
                    newSyntheticActions = reducer_setCurrentDay(currentAction, mutableState);
                    break;
                case "APPEND INGREDIENT":
                    newSyntheticActions = reducer_appendIngredient(currentAction, mutableState);
                    break;
                case "REMOVE INGREDIENT":
                    newSyntheticActions = reducer_removeIngredient(currentAction, mutableState);
                    break;
                case "CHANGE FOOD NAME":
                    newSyntheticActions = reducer_changeFoodName(currentAction, mutableState);
                    break;
                default:
                    // make an exception for initialisation done by Redux itself
                    if (currentAction.type.startsWith("@@redux/INIT")) break;

                    console.error(`@Reducer: unhandled action: ${currentAction.type}`);
                    throw new Error(`Unhandled action: ${currentAction.type}`);
            }

            console.debug(`@Reducers: additional actions from reducer for ${currentAction.type}: \n`,
                    JSON.stringify(newSyntheticActions));

            actionsToProcess.push(...newSyntheticActions);
            currentAction = actionsToProcess.shift();
        } while(currentAction !== undefined)
        // if no changes were made, Immer returns the original object
    });
}

// CONVENTION
// functions of the form "reducer_*" take two arguments: action, mutable state

const reducer_importData = (action: ImportDataAction, mutableState: State): Action[] => {
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
    const mergedData = mutableState.foodData.concat(action.data);  // TODO: remove casting
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

const reducer_changeIngredientQuantity =
    ({ newQuantity, context }: ChangeIngredientQuantityAction, mutableState: State): Action[] => {
        const [layer1, layer2, remainingContext] = context.peelTwoLayers();
        const ingredientPosInMeal = (layer1 as PositionLayer).pos;
        const mealRef = (layer2 as RefLayer).ref;

        const meal = mutableState.findFood(mealRef);
        const updatedMeal = applyFunctionsTo(meal, [
            doUpdateVersion(mutableState),
            doModifyIngredientQuantityAtPos(ingredientPosInMeal, newQuantity),
            doCalculateMacros(mutableState),
        ]);
        putFoodIntoMutableState(mutableState, updatedMeal); // upsert; this will either replace (if version unchaged) or add the food

        const followUpAction = replaceIngredient(updatedMeal.ref, remainingContext);
            // no check for remainingContext being empty; will it be a bug some day?
        return [followUpAction];

        // TODO: update EACH ingredient's 'usedBy', like so:
        // addRefToArrayIfNotThere(ingredient.usedBy, updatedMeal.id, updatedMeal.version);
    };

const reducer_replaceIngredient =
    ({ replacement, context }: ReplaceIngredientAction, mutableState: State): Action[] => {
        const [layer1, layer2, remainingContext] = context.peelTwoLayers();
        const ingredientPosition = (layer1 as PositionLayer).pos;
        const parentRef = (layer2 as RefLayer).ref;

        const parentFood = mutableState.findFood(parentRef);
        const updatedParentFood = applyFunctionsTo(parentFood, [
            doUpdateVersion(mutableState),
            doUpdateIngredientAtPos(ingredientPosition, replacement),
            doCalculateMacros(mutableState),
        ]);
        
        // XXX: if days are mutable, this is always an insert
        putFoodIntoMutableState(mutableState, updatedParentFood);

        if (remainingContext.layersLeft() > 0) {
            return [replaceIngredient(updatedParentFood.ref, remainingContext)];
        } else {
            return [setCurrentDay(updatedParentFood.ref)];
        }

        // TODO: update each ingredients' 'usedBy'
};

const reducer_setCurrentDay = ({ dayRef }: SetCurrentDayAction, mutableState: State): Action[] => {
    mutableState.day = dayRef;
    return [];
};

const reducer_appendIngredient =
    ({ ingredientRef, context}: AppendIngredientAction, mutableState: State): Action[] => {
        const [layer1, remainingContext] = context.peelOneLayer();
        const parentFoodRef = (layer1 as RefLayer).ref;

        const parentFood = mutableState.findFood(parentFoodRef);
        const updatedParentFood = applyFunctionsTo(parentFood, [
            doUpdateVersion(mutableState),
            doAddIngredient(ingredientRef),
            // maybe someday: update macros if the quantity is non-zero
        ]);

        putFoodIntoMutableState(mutableState, updatedParentFood);

        return [replaceIngredient(updatedParentFood.ref, remainingContext)];
    };

const reducer_removeIngredient = (
    { context }: RemoveIngredientAction,
    mutableState: State,
): Action[] => {
    const [layer1, layer2, remainingContext] = context.peelTwoLayers();
    const ingredientPosition = (layer1 as PositionLayer).pos;
    const parentFoodRef = (layer2 as RefLayer).ref;
    const parentFood = mutableState.findFood(parentFoodRef);

    const updateParentFood = applyFunctionsTo(parentFood, [
        doUpdateVersion(mutableState),
        doRemoveIngredient(ingredientPosition),
        doCalculateMacros(mutableState),
    ]);

    putFoodIntoMutableState(mutableState, updateParentFood);

    return [replaceIngredient(updateParentFood.ref, remainingContext)];
    
    // TODO: update ingredient food's 'usedBy'
};

const reducer_changeFoodName = (
    { newName, context }: ChangeFoodNameAction,
    mutableState: State,
): Action[] => {
    const [layer1, remainingContext] = context.peelOneLayer();
    const foodRef = (layer1 as RefLayer).ref;

    const food = mutableState.findFood(foodRef);
    const updatedFood = applyFunctionsTo(food, [
        doChangeName(newName),
    ]);

    putFoodIntoMutableState(mutableState, updatedFood);

    return [replaceIngredient(updatedFood.ref, remainingContext)];
};


// helper to be used with 'applyFunctionsTo'
const doModifyIngredientQuantityAtPos = (posToUpdate: number, newQuantity: number) => (meal: Food): Food => {
    // PERF: do not update version if it was not used by anything
    //       (requires the 'usedBy' field changes to be implemented)

    // PERF: if new quantity is the same, return the same object

    const quantityAsNumber = Number.parseFloat(newQuantity.toString());
    if (!Number.isFinite(quantityAsNumber))
        throw new Error(`The new quantity '${newQuantity}' is not a number`);

    return Immer_produce(meal, m => {
        const ingredient = filterOne(m.ingredientsRefs, x => x.position === posToUpdate);
        ingredient.quantity = newQuantity;
    });

};

// helper to be used with 'applyFunctionsTo'
const doUpdateIngredientAtPos = (ingredientPosition: number, replacement: Ref) => (meal: Food): Food => 
    Immer_produce(meal, m => {
        const ingredient = filterOne(m.ingredientsRefs, x => x.position === ingredientPosition);
        ingredient.ref = replacement;
    });


// helper to be used with 'applyFunctionsTo'
const doCalculateMacros = (state: State) => (meal: Food): Food => {
    const handledTypes = [FoodType.Meal, FoodType.Day, FoodType.Week];

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

    const newMacros = new Macros(
        mealIngredients.reduce(sumMacro('fat'), 0),
        mealIngredients.reduce(sumMacro('protein'), 0),
        mealIngredients.reduce(sumMacro('carbs'), 0),
    );

    return Immer_produce(meal, x => void (x.macros = newMacros));
    
    // TODO: calculate also uncertainty
};

// helper to be used with 'applyFunctionsTo'
const doUpdateVersion = (state: State) => (food: Food): Food => {
    const latestVersionOfFood = state.findFoodLatest(food.ref.id);
    const newVersion = latestVersionOfFood.ref.ver + 1;

    return Immer_produce(food, f => void (f.ref.ver = newVersion));
};

const doAddIngredient = (ingredientRef: Ref) => (parentFood: Food): Food => {
    const maxPos = parentFood.ingredientsRefs
        .reduce((r1, r2) => r1.position > r2.position ? r1 : r2)
        .position;
    const newIngredient = new Ingredient(ingredientRef, maxPos + 1, /*quantity:*/ 0, null);

    return Immer_produce(parentFood, f => void
        f.ingredientsRefs.push(newIngredient)
    );
};

const doRemoveIngredient = (positionToRemove: number) => (parentFood: Food): Food => {
    return Immer_produce(parentFood, f => {
        f.ingredientsRefs = f.ingredientsRefs.filter(x => x.position != positionToRemove);
    });
};

const doChangeName = (newName: string) => (food: Food): Food => {
    return Immer_produce(food, f => void (f.name = newName));
};

// helper to be used with 'applyFunctionsTo'
const doClearDependingMeals = () => (food: Food): Food => {
    return Immer_produce(food, f => void (f.usedBy = []));
};


const addRefToArrayIfNotThere = (someArray: any[], id: number, version: number): void => {
    for (let item of someArray) {
        if (item.id === id && item.version === version) return;
    }
    someArray.push({id, version});
};

