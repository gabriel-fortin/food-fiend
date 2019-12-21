import { createStore } from 'redux';
import Reducer from '../ReduxyStuff/Reducers.js'

function createEmptyStore() {
    const initialStateShape = {
        current: {
            foodData: [],
        },
        history: null,
    };

    return createStore(Reducer, initialStateShape);
}

export { createEmptyStore };
