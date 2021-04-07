import Immer_produce, { Draft } from 'immer';

import { Food, Ref, Ingredient, FoodType, Macros, StorageInfo, WeekExtra } from 'Model';
import { PositionLayer, RefLayer, LayerKind, assertRefLayer } from 'Onion';
import { SetMessageAction, setErrorMessage } from 'UI/ShowToasts';
import { eqRef, filterOne } from "tools";
import { WeekEditStoreData } from 'Component/WeekEditor';
import { OpenWeekEditorAction, SaveWeekEditorAction, CancelWeekEditorAction } from 'Component/WeekEditor/Actions';

import { State, mutatePutFood as putFoodIntoMutableState } from './Store';
import {
    ImportDataAction, ChangeIngredientQuantityAction, ReplaceIngredientAction,
    AppendIngredientAction, RemoveIngredientAction,
    ChangeFoodNameAction, AddFoodAction, ChangeFoodVersionAction,
} from './DataActions';
import { replaceIngredient, appendIngredient } from './DataActionCreators';
import { SetRootRefAction } from './UncategorisedActions';
import { setRootRef } from './UncategorisedActionCreators';
import { Action } from './ActionRegister';


/**
 * Helper to keep the original object unchanged
 * @param {*} initialObject object to be transformed by the functions
 * @param {*} functions functions that will transform a copy of the object
 */
function copyAndModify<T>(initialObject: T, functions: ((o: T) => void)[]): T {
    return Immer_produce(initialObject,
        (draftObj: Draft<T>) => {
            functions.forEach(fun => fun(draftObj as T));
        }
    );
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
        /// we start with empty queue of actions to handle
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
                case "SET ROOT REF":
                    newSyntheticActions = reducer_setRootRef(currentAction, mutableState);
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
                case "CHANGE FOOD VERSION":
                    newSyntheticActions = reducer_changeFoodVersion(currentAction, mutableState);
                    break;
                case "ADD_FOOD":
                    newSyntheticActions = reducer_addFood(currentAction, mutableState);
                    break;
                case "SET MESSAGE":
                    newSyntheticActions = reducer_setMessage(currentAction, mutableState);
                    break;
                case "WEEK EDITOR - OPEN":
                    newSyntheticActions = reducer_weekEditor_open(currentAction, mutableState);
                    break;
                case "WEEK EDITOR - SAVE":
                    newSyntheticActions = reducer_weekEditor_save(currentAction, mutableState);
                    break;
                case "WEEK EDITOR - CANCEL":
                    newSyntheticActions = reducer_weekEditor_cancel(currentAction, mutableState);
                    break;
                default:
                    // needs casting because, for TypeScript, all values of 'type' were already handled above
                    const actionType = (currentAction as any).type;

                    // make an exception for initialisation done by Redux itself
                    if (actionType.match(/^@@.*INIT/)) break;

                    console.error(`@Reducer: unhandled action: ${actionType}`);
                    throw new Error(`Unhandled action: ${actionType}`);
            }

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

    const importErrorCount = action.data.reduce((errCount, food, i) => {
        if (!food) {
            console.error(`reducer_importData: position ${i}: no food object, it's value is '${food}'`);
            return errCount+1;
        }
        return errCount;
    }, 0);

    if (importErrorCount !== 0) {
        return [setErrorMessage(`${importErrorCount} errors while importing data`)];
    }

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
        const updatedMeal = copyAndModify(meal, [
            doUpdateVersion(mutableState),
            doUpdateStorageInfo,
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
            case LayerKind.ROOT_REF:
                return [setRootRef(replacement)];
            default:
                throw new Error(`Didn't know what to do with a single layer` +
                    ` of kind '${onlyLayer.kind}' left in Onion`)
        }
    }

    const [layer1, layer2, remainingContext] = context.peelTwoLayers();
    const ingredientPosition = (layer1 as PositionLayer).pos;
    const parentRef = (layer2 as RefLayer).ref;

    const parentFood = mutableState.findFood(parentRef);
    const updatedParentFood = copyAndModify(parentFood, [
        doUpdateVersion(mutableState),
        doUpdateStorageInfo,
        doUpdateIngredientAtPos(ingredientPosition, replacement),
        doCalculateMacros(mutableState),
    ]);

    // XXX: if days are mutable, this is always an insert
    putFoodIntoMutableState(mutableState, updatedParentFood);

    return [replaceIngredient(updatedParentFood.ref, remainingContext)];

        // TODO: update each ingredients' 'usedBy'
};

const reducer_setRootRef = ({ rootRef }: SetRootRefAction, mutableState: State): Action[] => {
    mutableState.rootRef = rootRef;
    return [];
};

const reducer_appendIngredient =
    ({ ingredientRef, context}: AppendIngredientAction, mutableState: State): Action[] => {
        if (context.layersLeft() === 0) {
            console.error(`Cannot append ingredient when context is empty`);
            return [];
        }

        const [layer1, remainingContext] = context.peelOneLayer();
        if (layer1.kind === "ROOT REF LAYER") return [setRootRef(ingredientRef)];

        const parentFoodRef = assertRefLayer(layer1).ref;
        const parentFood = mutableState.findFood(parentFoodRef);
        const updatedParentFood = copyAndModify(parentFood, [
            doUpdateVersion(mutableState),
            doUpdateStorageInfo,
            doAddIngredient(ingredientRef),
            doCalculateMacros(mutableState),
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

    const updateParentFood = copyAndModify(parentFood, [
        doUpdateVersion(mutableState),
        doUpdateStorageInfo,
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
    const updatedFood = copyAndModify(food, [
        doUpdateVersion(mutableState),
        doUpdateStorageInfo,
        doChangeName(newName),
    ]);

    putFoodIntoMutableState(mutableState, updatedFood);

    return [replaceIngredient(updatedFood.ref, remainingContext)];
};

const reducer_changeFoodVersion = (
    { newVersion, context }: ChangeFoodVersionAction,
    mutableState: State,
): Action[] => {
    const [layer1, remainingContext] = context.peelOneLayer();
    const foodRef = (layer1 as RefLayer).ref;

    const updatedFoodRef = {
        ...foodRef,
        ver: newVersion,
    };

    return [replaceIngredient(updatedFoodRef, remainingContext)];
};

const reducer_addFood = (
    { context, foodType, name, unit, extra }: AddFoodAction,
    mutableState: State
): Action[] => {
    const food = createFood(mutableState, name, foodType, unit, extra);

    putFoodIntoMutableState(mutableState, food);

    return [appendIngredient(food.ref, context)];
};

// TODO: check whether copies of food are created in store or the existing one updated (that would be sad)

const reducer_weekEditor_open = (
    { context, weekRef }: OpenWeekEditorAction,
    mutableState: State,
    ): Action[] => {
        let weekDetails: Omit<WeekEditStoreData, "weekRef" | "callerContext">;
        
        if (weekRef === null) {
            weekDetails = {
                weekName: "",
                weekStartDate: new Date(),
            };
        } else {
            const weekData = mutableState.findFood(weekRef);
            if (weekData.type !== FoodType.Week) {
                console.error(`Ignoring attempt to open week editor.`
                    + ` Food is not of type 'Week'. The actual type is '${weekData.type}'`);
                return [];
            }

            weekDetails = {
                weekName: weekData.name,
                weekStartDate: new Date((weekData.extra as WeekExtra).startDate),
            };
        }

        // keep invariant:  isOpen == true  <=> data != null
        mutableState.editWeek.isOpen = true;
        mutableState.editWeek.data = {
            weekRef,
            callerContext: context,
            ...weekDetails,
        };
        
        return [];
    };
    
const reducer_weekEditor_save = (
    { weekName, weekStartDate }: SaveWeekEditorAction,
    mutableState: State,
): Action[] => {
    // the Save action is expected to be called only when  isOpen == true
    // invariant:  isOpen == true  <=>  mutableState.editWeek.data != null
    const editorData = mutableState.editWeek.data;
    if (editorData === null) {
        const msg = `unexpected situation: "mutableState.editWeek.data" is null`;
        console.error(`${msg};  mutableState.editWeek.isOpen: ${mutableState.editWeek.isOpen}`);
        throw new Error(msg);
    }

    let weekFood: Food;
    if (editorData.weekRef === null) {
        weekFood = createFood(mutableState, weekName, FoodType.Week, "week");
    } else {
        weekFood = mutableState.findFood(editorData.weekRef);
        weekFood = copyAndModify(weekFood, [
            doUpdateVersion(mutableState),
        ]);
    }

    weekFood = copyAndModify(weekFood, [
        doUpdateStorageInfo,
        doChangeName(weekName),
        doChangeStartDate(weekStartDate),
    ]);
    

    putFoodIntoMutableState(mutableState, weekFood);

    // keep invariant:  isOpen == true  <=>  mutableState.editWeek.data != null
    mutableState.editWeek.isOpen = false;
    mutableState.editWeek.data = null;

    return [replaceIngredient(weekFood.ref, editorData.callerContext)];
};

const reducer_weekEditor_cancel = (
    {}: CancelWeekEditorAction,
    mutableState: State,
): Action[] => {
    // keep invariant:  isOpen == true  <=> data != null
    mutableState.editWeek.isOpen = false;
    mutableState.editWeek.data = null;

    return [];
};

const reducer_setMessage = (
    { messagePayload }: SetMessageAction,
    mutableState: State
): Action[] => {
    mutableState.message = messagePayload;
    return [];
};


// helper
const createFood = (mutableState: State, name: string, foodType: FoodType, unit: string, extra: object = {}): Food => {
    return new Food(
        mutableState.getNewRef(),
        name,
        foodType,
        new Macros(0, 0, 0),
        unit,
        /* portion size: */ 1,
        /* portions: */ 1,
        extra,
    );
};

// mutating helper
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

// mutating helper
const doUpdateIngredientAtPos = (ingredientPosition: number, replacement: Ref) => (meal: Food): void => {
    const ingredient = filterOne(meal.ingredientsRefs, x => x.position === ingredientPosition);
    ingredient.ref = replacement;
};


// mutating helper
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

// mutating helper
const doUpdateVersion = (state: State) => (food: Food): void => {
    const latestVersionOfFood = state.findFoodLatest(food.ref.id);
    const newVersion = latestVersionOfFood.ref.ver + 1;

    food.ref.ver = newVersion;
};

// mutating helper
const doAddIngredient = (ingredientRef: Ref) => (parentFood: Food): void => {
    const maxPos = parentFood.ingredientsRefs
        .reduce((acc, r2) => Math.max(acc, r2.position), 0);
    const newIngredient = new Ingredient(ingredientRef, maxPos + 1, /*quantity:*/ 0, null);

    parentFood.ingredientsRefs.push(newIngredient);
};

// mutating helper
const doRemoveIngredient = (positionToRemove: number) => (parentFood: Food): void => {
    parentFood.ingredientsRefs = parentFood.ingredientsRefs.filter(x => x.position !== positionToRemove);
};

// mutating helper
const doChangeName = (newName: string) => (food: Food): void => {
    food.name = newName;
};

// mutating helper
const doChangeStartDate = (startDate: string) => (food: Food): void => {
    const isoDateRegexp = /^\d{4}-\d{2}-\d{2}$/;
    const userFriendlyFormat = "yyyy-mm-dd";
    if (!startDate.match(isoDateRegexp)) {
        throw new Error(`When changing week start date: value '${startDate}' is incorrect; `
            + `expected format: ${userFriendlyFormat}`);
    }

    (food.extra as WeekExtra).startDate = startDate;
};

// mutating helper
const doUpdateStorageInfo = (food: Food): void => {
    food.extra = {
        ...food.extra,
        ...new StorageInfo(new Date(), /*isInitialItem:*/ false),
    };
}

