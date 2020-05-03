import { Food, FoodType, Ref } from 'Model';

export class State {
    
    current: {
        foodData: Food[];
    };

    history: any = null;

    constructor() {
        this.current = {
            foodData: [],
        };
    }

    /** Finds all food items having the specified id */
    findFoodAllVersions(foodId: typeof Ref.prototype.id): Food[] {
        return findFoodAllVersions(this, foodId);
    }

    /** Finds the newest food item having the specified id */
    findFoodLatest(foodId: typeof Ref.prototype.id): Food {
        return findFoodLatest(this, foodId);
    }

    /** Finds the food item having the specified ref */
    findFood(ref: Ref): Food {
        return findFood(this, ref);
    }

}

// helper
const chooseFoodWithHigherVersion = (foodA: Food, foodB: Food) =>
    foodA.ref.ver > foodB.ref.ver ? foodA : foodB;

function findFoodAllVersions(state: State, foodId: typeof Ref.prototype.id): Food[] {
    return state.current.foodData.filter(food => food.ref.id === foodId);
}

function findFoodLatest(state: State, foodId: typeof Ref.prototype.id): Food {
    const allVersionsOfSelectedFood = findFoodAllVersions(state, foodId);

    if (allVersionsOfSelectedFood.length === 0) {
        console.error(`Store: find food -- no entries for food with id '${foodId}'`);
        throw new NoFoodFoundError(`No food found with id: ${foodId}`);
    }

    return allVersionsOfSelectedFood.reduce(chooseFoodWithHigherVersion);
}

function findFood(state: State, foodRef: Ref): Food {
    const allVersionsOfSelectedFood = findFoodAllVersions(state, foodRef.id);

    if (allVersionsOfSelectedFood.length === 0) {
        console.error(`Store: find food -- no entries for food with id '${foodRef.id}'`);
        throw new NoFoodFoundError(`No food found with id: ${foodRef.id}`);
    }

    const chosenVersionOfFood = allVersionsOfSelectedFood
        .filter(food => food.ref.ver === foodRef.ver);

    if (chosenVersionOfFood.length > 1) {
        console.error(`Expected at most one food with id ${foodRef.id}` +
            ` and version ${foodRef.ver} but found ${chosenVersionOfFood.length}`, chosenVersionOfFood);
        throw new Error(`Found two (or more) food items with the same id and version!!!  ref: ${foodRef}`);
    }

    if (chosenVersionOfFood.length === 0)
        throw new NoFoodFoundError(`No food found with ref: ${foodRef}`);

    return chosenVersionOfFood[0];
}

export function getAllMeals(state: State): Food[] {
    const mealsGroupedById: Map<number, Food[]> = state.current.foodData
        .filter(food => food.type === FoodType.Compound)
        .reduce((groupedMeals, food) => {
            const group = groupedMeals.get(food.ref.id) || [];
            group.push(food);
            groupedMeals.set(food.ref.id, group);
            return groupedMeals;
        }, new Map<number, Food[]>());

    const latestVersionOfEachMeal: Food[] = [];

    mealsGroupedById.forEach((mealVersions: Food[], _key: number) => {
        const mealLatestVersion = mealVersions.reduce(chooseFoodWithHigherVersion);
        latestVersionOfEachMeal.push(mealLatestVersion);
    })

    return latestVersionOfEachMeal;
}

/**
 * Either adds food to state or updates (if a food with same id and version already exists)
 * @param {*} mutableState state that is allowed to be changed
 * @param {*} food 
 */
export function mutatePutFood(mutableState: State, food: Food): void {
    // TODO: use this function in the "import data" reducer (so all mutations happen using this function)

    function updateExistingFoodInState(existsingFood: Food) {
        for (var prop in food) {
            // cast to 'any' to access properties via indexing
            (existsingFood as any)[prop] = (food as any)[prop];
        }
    }
    function addNewFoodToState() {
        mutableState.current.foodData.push(food);
    }

    const existsingFood = findFood(mutableState, food.ref);
    if (existsingFood === null) {
        // the requested version doesn't exist => add
        addNewFoodToState();
        return;
    }
    // food exists in store => update
    updateExistingFoodInState(existsingFood);
}


export class NoFoodFoundError extends Error {

}


// TODO: Store imports from Reducers, Reducers imports from Store; fix this (extract State class?)
