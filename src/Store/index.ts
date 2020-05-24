import { immerable } from 'immer';

import {
    importData,
    changeIngredientQuantity,
    replaceIngredient,
    addSimpleFood,
    setCurrentDay,
    appendIngredient,
} from './ActionCreators';
import { rootReducer as storeReducer } from './Reducers';
import { mutatePutFood, getAllMeals, State, NoFoodFoundError } from './Store';
import { AppStateProvider, useAppState } from './Hooks';


const immeriseModels = () => {
    (State.prototype as any)[immerable] = true;
};
immeriseModels();


export type ImportDataAction = import('./ActionCreators').ImportDataAction;
export type ChangeIngredientQuantityAction = import('./ActionCreators').ChangeIngredientQuantityAction;
export type AddSimpleFoodAction = import('./ActionCreators').AddSimpleFoodAction;
export type ReplaceIngredientAction = import('./ActionCreators').ReplaceIngredientAction;
export type AppendIngredientAction = import('./ActionCreators').AppendIngredientAction;
export type Action = import('./ActionCreators').Action;

export {
    /* action creators */
    importData,
    changeIngredientQuantity,
    replaceIngredient,
    addSimpleFood,
    setCurrentDay,
    appendIngredient,

    /* main reducer */
    storeReducer,

    /* helpers / accessors to State*/
    AppStateProvider,
    useAppState,
    mutatePutFood,
    getAllMeals,

    /* classes */
    State,
    NoFoodFoundError,
};
