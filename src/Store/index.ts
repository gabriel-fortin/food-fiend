import { immerable } from 'immer';

import { rootReducer as storeReducer } from './Reducers';
import { mutatePutFood, State, NoFoodFoundError } from './Store';
import { AppStateProvider, useAppState, useTypedSelector } from './Hooks';



const immeriseModels = () => {
    (State.prototype as any)[immerable] = true;
};
immeriseModels();



// export * from './ActionCreators';
export * from './DataActions';
export * from './DataActionCreators';
export * from './UncategorisedActions';
export * from './UncategorisedActionCreators';
export {
    /* main reducer */
    storeReducer,

    /* helpers / accessors to State*/
    AppStateProvider,
    useAppState,
    useTypedSelector,
    mutatePutFood,

    /* classes */
    State,
    NoFoodFoundError,
};
