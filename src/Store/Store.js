import { createStore } from 'redux';
import Reducer from '../ReduxyStuff/Reducers.js'
import FoodType from '../data/FoodType.js';

function createEmptyStore() {
    const initialStateShape = {
        current: {
            foodData: [],
        },
        history: null,
    };

    return createStore(Reducer, initialStateShape);
}

const selectLatestVersionFromArray = (foodA, foodB) => foodA.version > foodB.version ? foodA : foodB;

const LATEST = Symbol("latest version");
function findFood(state, foodId, foodVersion = LATEST) {
    const allVersionsOfSelectedFood = state.current.foodData
            .filter(food => food.id === foodId);

    if (allVersionsOfSelectedFood.length === 0) {
        console.error(`Store: find food -- no entries for food with id '${foodId}'`);
        return undefined;
    }

    const chosenVersionOfFood = (foodVersion === LATEST)
            ? [allVersionsOfSelectedFood.reduce(selectLatestVersionFromArray)]
            : allVersionsOfSelectedFood.filter(food => food.version === foodVersion);

    if (chosenVersionOfFood.length > 1) {
        console.error(`Expected at most one food with id ${foodId}` +
            ` and version ${foodVersion} but found ${chosenVersionOfFood.length}`);
        return undefined;
    }

    return chosenVersionOfFood[0];  // undefined if chosenVersionOfFood.length == 0
}

function getAllMeals(state) {
    const mealsGroupedById = state.current.foodData
        .filter(food => food.type === FoodType.Compound)
        .reduce((groupedMeals, food) => {
            const group = groupedMeals[food.id] || [];
            group.push(food);
            groupedMeals[food.id] = group;
            return groupedMeals;
        }, {});

    const latestVersionOfEachMeal = [];
    // eslint-disable-next-line no-unused-vars
    for (let [id, mealVersions] of Object.entries(mealsGroupedById)) {
        const mealLatestVersion = mealVersions.reduce(selectLatestVersionFromArray);
        latestVersionOfEachMeal.push(mealLatestVersion);
    }

    return latestVersionOfEachMeal;
}

/**
 * Either adds food to state or updates (if a food with same id and version already exists)
 * @param {*} mutableState state that is allowed to be changed
 * @param {*} food 
 */
function mutatePutFood(mutableState, food) {
    // TODO: use this function in the "import data" reducer (so all mutations happen using this function)

    function updateExistingFoodInState(existsingFood) {
        for (var prop in food) {
            existsingFood[prop] = food[prop];
        }
    }
    function addNewFoodToState() {
        mutableState.current.foodData.push(food);
    }

    const existsingFood = findFood(mutableState, food.id, food.version);
    if (existsingFood === undefined) {
        // the requested version doesn't exist => add
        addNewFoodToState();
        return;
    }
    // food exists in store => update
    updateExistingFoodInState(existsingFood);
}


export { createEmptyStore, findFood, mutatePutFood, LATEST, getAllMeals };
