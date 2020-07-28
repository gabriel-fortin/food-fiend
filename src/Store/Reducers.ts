import Immer_produce, { Draft } from 'immer';

import { Food, Ref, Ingredient, FoodType, Macros, StorageInfo, eqRef } from 'Model';
import { PositionLayer, RefLayer, LayerKind } from 'Onion';

import { State, mutatePutFood as putFoodIntoMutableState } from './Store';
import {
    replaceIngredient, setCurrentDay, appendIngredient, setErrorMessage,
    Action,
    ImportDataAction, ChangeIngredientQuantityAction, ReplaceIngredientAction,
     SetCurrentDayAction, AppendIngredientAction, RemoveIngredientAction,
     ChangeFoodNameAction, AddFoodAction, SetMessageAction,
} from './ActionCreators';


/**
 * Helper function prettier chaining
 * @param {*} initialObject object to be transformed by the functions
 * @param {*} functions functions tha will transform the object
 */
function applyFunctionsTo<T>(initialObject: T, functions: ((o: T) => void)[]): T {
    return Immer_produce(initialObject,
        (draftObj: Draft<T>) => {
            functions.forEach(fun => fun(draftObj as T));
        }
    );
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
                case "ADD_FOOD":
                    newSyntheticActions = reducer_addFood(currentAction, mutableState);
                    break;
                case "SET MESSAGE":
                    newSyntheticActions = reducer_setMessage(currentAction, mutableState);
                    break;
                default:
                    // needs casting because, for TypeScript, all values of 'type' were already handled above
                    const actionType = (currentAction as any).type;

                    // make an exception for initialisation done by Redux itself
                    if (actionType.startsWith("@@redux/INIT")) break;

                    console.error(`@Reducer: unhandled action: ${actionType}`);
                    throw new Error(`Unhandled action: ${actionType}`);
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
        if (eqRef(acc.lastElRef, item.ref)) {
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
            doUpdateStorageInfo(),
            doModifyIngredientQuantityAtPos(ingredientPosInMeal, newQuantity),
            doCalculateMacros(mutableState),
        ]);
        putFoodIntoMutableState(mutableState, updatedMeal); // upsert; this will add the food (because version changed)

        const followUpAction = replaceIngredient(updatedMeal.ref, remainingContext);
            // no check for remainingContext being empty; will it be a bug some day?
        return [followUpAction];

        // TODO: update EACH ingredient's 'usedBy', like so:
        // addRefToArrayIfNotThere(ingredient.usedBy, updatedMeal.id, updatedMeal.version);
    };

const reducer_replaceIngredient = (
    { replacement, context }: ReplaceIngredientAction,
    mutableState: State
): Action[] => {
    if (context.layersLeft() === 0) {
        return [];  // nothing more to process
    }

    if (context.layersLeft() === 1) {
        const [onlyLayer] = context.peelOneLayer();
        switch (onlyLayer.kind) {
            case LayerKind.CDAY:
                return [setCurrentDay(replacement)];
            default:
                throw new Error(`Didn't know what to do with a single layer` +
                    ` of kind '${onlyLayer.kind}' left in Onion`)
        }
    }

    const [layer1, layer2, remainingContext] = context.peelTwoLayers();
    const ingredientPosition = (layer1 as PositionLayer).pos;
    const parentRef = (layer2 as RefLayer).ref;

    const parentFood = mutableState.findFood(parentRef);
    const updatedParentFood = applyFunctionsTo(parentFood, [
        doUpdateVersion(mutableState),
        doUpdateStorageInfo(),
        doUpdateIngredientAtPos(ingredientPosition, replacement),
        doCalculateMacros(mutableState),
    ]);

    // XXX: if days are mutable, this is always an insert
    putFoodIntoMutableState(mutableState, updatedParentFood);

    return [replaceIngredient(updatedParentFood.ref, remainingContext)];

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
            doUpdateStorageInfo(),
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
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    const [layer0, outerContext] = context.peelOneLayer();

    // TODO: update 'usedBy' of the food being removed
        // const foodRef = (layer0 as RefLayer).ref;
        // mutableState.findFood(foodRef).usedBy = ...

    if (outerContext.layersLeft() === 0) {
        const message = `Nothing to remove the item from; Onion (context) is empty`;
        console.error(message);
        return [setErrorMessage(message)];
    }

    const [layer1, layer2, remainingContext] = outerContext.peelTwoLayers();
    const ingredientPosition = (layer1 as PositionLayer).pos;
    const parentFoodRef = (layer2 as RefLayer).ref;
    const parentFood = mutableState.findFood(parentFoodRef);

    const updateParentFood = applyFunctionsTo(parentFood, [
        doUpdateVersion(mutableState),
        doUpdateStorageInfo(),
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
        doUpdateVersion(mutableState),
        doUpdateStorageInfo(),
        doChangeName(newName),
    ]);

    putFoodIntoMutableState(mutableState, updatedFood); // this usage replaces food as ref didn't change (doUpdateVersion was not called)

    return [replaceIngredient(updatedFood.ref, remainingContext)];
};

const reducer_addFood = (
    { context, foodType, name, unit, extra }: AddFoodAction,
    mutableState: State
): Action[] => {
    const food = new Food(
        mutableState.getNewRef(),
        name,
        foodType,
        new Macros(0, 0, 0),
        unit,
        /* portion size: */ 1,
        /* portions: */ 1,
        extra,
    );

    putFoodIntoMutableState(mutableState, food);

    if (context.layersLeft() === 0) return [];
    return [appendIngredient(food.ref, context)];
};

const reducer_setMessage = (
    { messagePayload }: SetMessageAction,
    mutableState: State
): Action[] => {
    mutableState.message = messagePayload;
    return [];
};


// helper to be used with 'applyFunctionsTo'
const doModifyIngredientQuantityAtPos = (posToUpdate: number, newQuantity: number) => (meal: Food): void => {
    // PERF: do not update version if it was not used by anything
    //       (requires the 'usedBy' field changes to be implemented)

    // PERF: if new quantity is the same, return the same object

    const quantityAsNumber = Number.parseFloat(newQuantity.toString());
    if (!Number.isFinite(quantityAsNumber))
        throw new Error(`The new quantity '${newQuantity}' is not a number`);

    const ingredient = filterOne(meal.ingredientsRefs, x => x.position === posToUpdate);
    ingredient.quantity = newQuantity;
};

// helper to be used with 'applyFunctionsTo'
const doUpdateIngredientAtPos = (ingredientPosition: number, replacement: Ref) => (meal: Food): void => {
    const ingredient = filterOne(meal.ingredientsRefs, x => x.position === ingredientPosition);
    ingredient.ref = replacement;
};


// helper to be used with 'applyFunctionsTo'
const doCalculateMacros = (state: State) => (meal: Food): void => {
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

    const sumQuantity = mealIngredients.reduce((acc, x) => acc + x.ingredient.quantity, 0);

    meal.macros = new Macros(
        mealIngredients.reduce(sumMacro('fat'), 0) * 100 / sumQuantity,
        mealIngredients.reduce(sumMacro('protein'), 0) * 100 / sumQuantity,
        mealIngredients.reduce(sumMacro('carbs'), 0) * 100 / sumQuantity,
    );
    
    // TODO: calculate also uncertainty
};

// helper to be used with 'applyFunctionsTo'
const doUpdateVersion = (state: State) => (food: Food): void => {
    const latestVersionOfFood = state.findFoodLatest(food.ref.id);
    const newVersion = latestVersionOfFood.ref.ver + 1;

    food.ref.ver = newVersion;
};

// helper to be used with 'applyFunctionsTo'
const doAddIngredient = (ingredientRef: Ref) => (parentFood: Food): void => {
    const maxPos = parentFood.ingredientsRefs
        .reduce((acc, r2) => Math.max(acc, r2.position), 0);
    const newIngredient = new Ingredient(ingredientRef, maxPos + 1, /*quantity:*/ 0, null);

    parentFood.ingredientsRefs.push(newIngredient);
};

// helper to be used with 'applyFunctionsTo'
const doRemoveIngredient = (positionToRemove: number) => (parentFood: Food): void => {
    parentFood.ingredientsRefs = parentFood.ingredientsRefs.filter(x => x.position !== positionToRemove);
};

// helper to be used with 'applyFunctionsTo'
const doChangeName = (newName: string) => (food: Food): void => {
    food.name = newName;
};

// helper to be used with 'applyFunctionsTo'
const doUpdateStorageInfo = () => (food: Food): void => {
    food.extra = {
        ...food.extra,
        ...new StorageInfo(new Date(), /*isInitialItem:*/ false),
    };
}

