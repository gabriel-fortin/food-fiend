import { Food, FoodType, Ref } from 'Model';


export abstract class State {
    
    foodData: Food[];
    day: Ref | null;

    history: any = null;

    protected constructor() {
        this.foodData = [];
        this.day = null;
    }

    static create(): State {
        return new StateImpl();
    }

    /** Finds all food items having the specified id */
    abstract findFoodAllVersions(foodId: typeof Ref.prototype.id): Food[];

    /** Finds the newest food item having the specified id */
    abstract findFoodLatest(foodId: typeof Ref.prototype.id): Food;

    /** Finds the food item having the specified ref */
    abstract findFood(ref: Ref): Food;
}


// helper
const chooseFoodWithHigherVersion = (foodA: Food, foodB: Food) =>
    foodA.ref.ver > foodB.ref.ver ? foodA : foodB;


export class StateImpl extends State {
    findFoodAllVersions(foodId: typeof Ref.prototype.id): Food[] {
        return this.foodData.filter(food => food.ref.id === foodId);
    }

    findFoodLatest(foodId: typeof Ref.prototype.id): Food {
        const allVersionsOfSelectedFood = this.findFoodAllVersions(foodId);
    
        if (allVersionsOfSelectedFood.length === 0) {
            console.error(`Store: find food -- no entries for food with id '${foodId}'`);
            throw new NoFoodFoundError(`No food found with id: ${foodId}`);
        }
    
        return allVersionsOfSelectedFood.reduce(chooseFoodWithHigherVersion);
    }

    findFood(foodRef: Ref): Food {
        const allVersionsOfSelectedFood = this.findFoodAllVersions(foodRef.id);
    
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
            throw new NoFoodFoundError(`No food found with ref: ${JSON.stringify(foodRef)}`);
    
        return chosenVersionOfFood[0];
    }

export function getAllMeals(state: State): Food[] {
    const mealsGroupedById: Map<number, Food[]> = state.foodData
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
        mutableState.foodData.push(food);
    }

    try {
        const existsingFood = mutableState.findFood(food.ref);
        // food exists in store => update
        updateExistingFoodInState(existsingFood);
    } catch (ex) {
        if (ex instanceof NoFoodFoundError) {
            // the requested version doesn't exist => add
            addNewFoodToState();
            return;
        }

        throw ex;
    }
}


export class NoFoodFoundError extends Error {

}


// TODO: Store imports from Reducers, Reducers imports from Store; fix this (extract State class?)
