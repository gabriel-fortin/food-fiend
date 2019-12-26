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

const LATEST = Symbol("latest version");
function findFood(state, foodId, foodVersion = LATEST) {
    if (foodVersion === LATEST) {
        // TODO: findFood when foodVersion=LATEST
        throw new Error("'findFood' at version LATEST is not implemented yet");
    }

    const allVersionsOfSelectedFood = state.current.foodData
            .filter(food => food.id === foodId);
    
    const theChosenOne = allVersionsOfSelectedFood.filter(food => food.version === foodVersion);
    if (theChosenOne.length !== 1) {
        console.error(`Expected exactly one food with id ${foodId}` +
            ` and version ${foodVersion} but found ${theChosenOne.length}`);
    }

    return theChosenOne[0];
}

function getAllMeals(state) {
    return state.current.foodData
        .filter(food => food.type === FoodType.Compound);
}


export { createEmptyStore, findFood, getAllMeals };
