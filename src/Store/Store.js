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
        throw new Error(`Store: find food -- no entries for food with id '${foodId}'`);
    }

    const chosenVersionOfFood = (foodVersion === LATEST)
            ? [allVersionsOfSelectedFood.reduce(selectLatestVersionFromArray)]
            : allVersionsOfSelectedFood.filter(food => food.version === foodVersion);

    if (chosenVersionOfFood.length !== 1) {
        console.error(`Expected exactly one food with id ${foodId}` +
            ` and version ${foodVersion} but found ${chosenVersionOfFood.length}`);
        // if there are more than one then the first one will be shown
    }

    return chosenVersionOfFood[0];
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
    for (let [id, mealVersions] of Object.entries(mealsGroupedById)) {
        const mealLatestVersion = mealVersions.reduce(selectLatestVersionFromArray);
        latestVersionOfEachMeal.push(mealLatestVersion);
    }

    return latestVersionOfEachMeal;
}


export { createEmptyStore, findFood, getAllMeals };
