import { immerable } from 'immer';

import { importData, changeIngredientQuantity, replaceIngredient, addSimpleFood, setCurrentDay } from './ActionCreators';
import { rootReducer as storeReducer } from './Reducers';
import { mutatePutFood, getAllMeals, State, NoFoodFoundError } from './Store';


const immeriseModels = () => {
    (State.prototype as any)[immerable] = true;
};
immeriseModels();


export type ImportDataAction = import('./ActionCreators').ImportDataAction;
export type ChangeIngredientQuantityAction = import('./ActionCreators').ChangeIngredientQuantityAction;
export type AddSimpleFoodAction = import('./ActionCreators').AddSimpleFoodAction;
export type ReplaceIngredientAction = import('./ActionCreators').ReplaceIngredientAction;
export type Action = import('./ActionCreators').Action;

export {
    importData, changeIngredientQuantity, replaceIngredient, addSimpleFood, setCurrentDay,
    storeReducer,
    mutatePutFood, getAllMeals, State, NoFoodFoundError,
};
