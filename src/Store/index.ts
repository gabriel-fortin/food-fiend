import { immerable } from 'immer';

import { rootReducer as storeReducer } from './Reducers';
import { mutatePutFood, State, NoFoodFoundError } from './Store';
import { AppStateProvider, useAppState } from './Hooks';



const immeriseModels = () => {
    (State.prototype as any)[immerable] = true;
};
immeriseModels();



export * from './ActionCreators';
export {
    /* main reducer */
    storeReducer,

    /* helpers / accessors to State*/
    AppStateProvider,
    useAppState,
    mutatePutFood,

    /* classes */
    State,
    NoFoodFoundError,
};
