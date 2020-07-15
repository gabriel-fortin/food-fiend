import { Food, FoodType, Ref, Message } from 'Model';


export abstract class State {
    
    foodData: Food[];
    day: Ref | null;
    message: Message | null;

    history: any = null;

    // for generating new IDs
    protected lastId: number = 1;

    protected constructor() {
        this.foodData = [];
        this.day = null;
        this.message = null;
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
    
    abstract getCurrentDay(): Ref | null;

    abstract getAllLatestFoods(): Food[];

    abstract getNewRef(): Ref;

    abstract getAllFoodOfType(soughtType: FoodType): Food[];

    abstract getMessage(): Message | null;

    abstract setMessage(message: Message | null): void;
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

    getCurrentDay(): Ref | null {
        return this.day;
    }

    getAllLatestFoods(): Food[] {
        type Id = typeof Ref.prototype.id;
        
        const takeHigherVersion: (acc: Map<Id, Food>, item: Food) => Map<Id, Food> = (acc, item) => {
            let selectedVersion = acc.get(item.ref.id);
            if (selectedVersion === undefined || selectedVersion.ref.ver < item.ref.ver) {
                acc.set(item.ref.id, item);
            }
            return acc;
        };

        const mapOfAllLatestFoods = this.foodData.reduce(takeHigherVersion, new Map<Id, Food>());
        return Array.from(mapOfAllLatestFoods.values());
    }

    getNewRef(): Ref {
        do {
            this.lastId++;
        } while(this.foodData.some(f => f.ref.id === this.lastId))

        return new Ref(this.lastId, 1);
    }

    getAllFoodOfType(soughtType: FoodType): Food[] {
        const foodsGroupedById: Map<number, Food[]> = this.foodData
            .filter(food => food.type === soughtType)
            .reduce((groupedFoods, food) => {
                const group = groupedFoods.get(food.ref.id) || [];
                group.push(food);
                groupedFoods.set(food.ref.id, group);
                return groupedFoods;
            }, new Map<number, Food[]>());
    
        const latestVersionOfEachFood: Food[] = [];
    
        foodsGroupedById.forEach((foodVersions: Food[], _key: number) => {
            const foodLatestVersion = foodVersions.reduce(chooseFoodWithHigherVersion);
            latestVersionOfEachFood.push(foodLatestVersion);
        })
    
        return latestVersionOfEachFood;
    }

    getMessage(): Message | null {
        return this.message;
    }

    setMessage(message: Message | null): void {
        this.message = message;
    }
}

/**
 * Either adds food to state or updates (if a food with same id and version already exists)
 * @param {*} mutableState state that is allowed to be changed
 * @param {*} food 
 */
export function mutatePutFood(mutableState: State, food: Food): void {
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
